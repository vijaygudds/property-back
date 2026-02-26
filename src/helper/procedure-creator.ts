interface TransactionFieldMapping {
    tableField?: string; // Optional, used for dynamic values
    transactionField: string;
    type?: string; // Optional, used for dynamic values
    value?: any; // Optional, used for static values
}

interface TransactionRowFieldMapping {
    tableField?: string; // Optional, used for dynamic values
    transactionRowField: string;
    type?: string; // Optional, used for dynamic values
    value?: any; // Optional, used for static values
}

interface TransactionRowConfiguration {
    fieldsMapping: TransactionRowFieldMapping[];
}

interface TransactionSideConfiguration {
    transactionRows: TransactionRowConfiguration[];
    isStatic: boolean; // Indicates if this side of the transaction is static
}

interface TransactionOptions {
    creditSide: TransactionSideConfiguration;
    debitSide: TransactionSideConfiguration;
    singleTransaction?: boolean; // Indicates if a single transaction is used for all rows
    fieldMapping?: TransactionFieldMapping[];
}

interface ProcedureOptions {
    readFromTable: string;
    transaction: TransactionOptions;
    additionalConditions?: string;
}

// Interface definitions remain the same

export function createTransactionProcedure(
    procedureName: string,
    options: ProcedureOptions,
): string {
    const variableDeclarations = new Set<string>();

    // Declare necessary variables
    const declareVariables = () => {
        const allFields = [
            ...options.transaction.creditSide.transactionRows.flatMap(
                (r) => r.fieldsMapping,
            ),
            ...options.transaction.debitSide.transactionRows.flatMap(
                (r) => r.fieldsMapping,
            ),
        ];
        allFields.forEach((field) => {
            if (field.tableField && field.type) {
                variableDeclarations.add(
                    `DECLARE v_${field.tableField} ${field.type};`,
                );
            }
        });
    };
    declareVariables();

    // Generate SQL for transaction row fields insertion
    const generateTransactionRowInserts = (
        sideConfig: TransactionSideConfiguration,
    ) => {
        return sideConfig.transactionRows
            .map((rowConfig) => {
                const columns = rowConfig.fieldsMapping
                    .map((f) => f.transactionRowField)
                    .join(', ');
                const values = rowConfig.fieldsMapping
                    .map((f) =>
                        f.value !== undefined ? f.value : `v_${f.tableField}`,
                    )
                    .join(', ');
                return `INSERT INTO transaction_row (transaction_id, ${columns}) VALUES (v_transaction_id, ${values});`;
            })
            .join('\n');
    };

    // Generate SQL for transaction fields (including root transaction)
    const generateTransactionFields = (
        fieldMappings: TransactionFieldMapping[] | undefined,
    ) => {
        const columns = fieldMappings
            ?.map((f) => f.transactionField)
            .join(', ');
        const values = fieldMappings
            ?.map((f) =>
                f.value !== undefined ? f.value : `v_${f.tableField}`,
            )
            .join(', ');
        return { columns, values };
    };

    // Construct SQL for transaction creation
    let transactionCreationSQL = '';
    let loopSQL = '';
    const { columns, values } = generateTransactionFields(
        options.transaction.fieldMapping,
    );
    if (options.transaction.singleTransaction) {
        transactionCreationSQL = `INSERT INTO transactions (${columns}) VALUES (${values}); SET v_transaction_id = LAST_INSERT_ID();`;
    } else {
        const combinedFields = new Set(
            [
                ...options.transaction.creditSide.transactionRows.flatMap((r) =>
                    r.fieldsMapping.map((f) => f.tableField),
                ),
                ...options.transaction.debitSide.transactionRows.flatMap((r) =>
                    r.fieldsMapping.map((f) => f.tableField),
                ),
            ].filter(Boolean),
        );

        const additionalConditionSQL = options.additionalConditions
            ? `AND (${options.additionalConditions})`
            : '';

        loopSQL = `
    DECLARE cur CURSOR FOR SELECT ${Array.from(combinedFields).join(
        ', ',
    )} FROM ${
        options.readFromTable
    } WHERE on_date = onDate ${additionalConditionSQL}; 
                   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE; 
                   OPEN cur; 
                   read_loop: LOOP 
                   FETCH cur INTO ${Array.from(combinedFields)
                       .map((field) => `v_${field}`)
                       .join(', ')}; 
                   IF done THEN 
                        LEAVE read_loop; 
                   END IF; 
                   INSERT INTO transactions (${columns}) VALUES (${values}); 
                   SET v_transaction_id = LAST_INSERT_ID(); 
                   
                   ${generateTransactionRowInserts(
                       options.transaction.creditSide,
                   )} 
                   ${generateTransactionRowInserts(
                       options.transaction.debitSide,
                   )} 
                   
                   END LOOP; 
                   CLOSE cur;`;
    }

    // Construct and return the full SQL procedure
    const procedureSQL = `
    DROP PROCEDURE IF EXISTS ${procedureName}; 
    CREATE PROCEDURE ${procedureName}(IN onDate VARCHAR(255)) 
    BEGIN 
        DECLARE done INT DEFAULT FALSE; 
        DECLARE v_transaction_id INT; 
        ${Array.from(variableDeclarations).join('\n')} 
        ${transactionCreationSQL} 
        ${loopSQL} 
    END;`;

    return procedureSQL;
}
