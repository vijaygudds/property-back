import {
    CHEQUEBOOK_CHARGE_RECEIVED_ON,
    COLLECTION_CHARGE_PAID_ON,
    COMMISSION_PAID_ON,
    COMMISSION_PAYABLE_ON,
    INTEREST_PAID_ON,
    INTEREST_PROVISION_ON,
    INTEREST_RECEIVED_ON,
    MINIMUM_BALANCE_CHARGE_RECEIVED_ON,
    PANEL_INTEREST_RECEIVED_ON,
    PRE_INTEREST_RECEIVED_ON,
    STATEMENT_CHARGE_RECEIVED_ON,
    TIME_OVER_INTEREST_ON,
} from './constants';

export const defaultSchemeAccounts = {
    // DefaultSchemeDefaultAccounts: [
    //     {
    //         under_scheme: 'Indirect Expenses',
    //         intermediate_text: '',
    //         Group: 'ROUND OF',
    //         PAndLGroup: 'ROUND OF',
    //     },
    //     {
    //         under_scheme: BRANCH_TDS_ACCOUNT,
    //         intermediate_text: '',
    //         Group: BRANCH_TDS_ACCOUNT,
    //         PAndLGroup: BRANCH_TDS_ACCOUNT,
    //     },
    //     {
    //         under_scheme: 'Indirect Expenses',
    //         intermediate_text: '',
    //         Group: 'Conveyance Expenses',
    //         PAndLGroup: 'Conveyance Expenses',
    //     },
    // ],
    CurrentSchemeDefaultAccounts: [
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COMMISSION_PAID_ON,
            Group: 'Commission Paid On Current',
            PAndLGroup: 'Commission Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: INTEREST_PAID_ON,
            Group: 'Interest Paid On Current',
            PAndLGroup: 'Interest Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: MINIMUM_BALANCE_CHARGE_RECEIVED_ON,
            Group: 'Minimum Balance Charge Received On Current',
            PAndLGroup: 'Minimum Balance Charge Received On Current',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: CHEQUEBOOK_CHARGE_RECEIVED_ON,
            Group: 'ChequeBook Charge Received On Current',
            PAndLGroup: 'ChequeBook Charge Received On Current',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: STATEMENT_CHARGE_RECEIVED_ON,
            Group: 'Statement Charge Received On Saving',
            PAndLGroup: 'Statement Charge Received On Saving',
        },
    ],
    SavingSchemeDefaultAccounts: [
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COMMISSION_PAID_ON,
            Group: 'Commission Paid On Saving',
            PAndLGroup: 'Commission Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: INTEREST_PAID_ON,
            Group: 'Interest Paid On Saving',
            PAndLGroup: 'Interest Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: MINIMUM_BALANCE_CHARGE_RECEIVED_ON,
            Group: 'Minimum Balance Charge Received On Saving',
            PAndLGroup: 'Minimum Balance Charge Received On Saving',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: CHEQUEBOOK_CHARGE_RECEIVED_ON,
            Group: 'ChequeBook Charge Received On Saving',
            PAndLGroup: 'ChequeBook Charge Received On Saving',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: STATEMENT_CHARGE_RECEIVED_ON,
            Group: 'Statement Charge Received On Saving',
            PAndLGroup: 'Statement Charge Received On Saving',
        },
    ],
    DDSSchemeDefaultAccounts: [
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COMMISSION_PAID_ON,
            Group: 'Commission Paid On DDS',
            PAndLGroup: 'Commission Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: INTEREST_PAID_ON,
            Group: 'Interest Paid On DDS',
            PAndLGroup: 'Interest Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COLLECTION_CHARGE_PAID_ON,
            Group: 'Collection Charges Paid On DDS',
            PAndLGroup: 'Collection Charges Paid On Deposit',
        },
    ],
    RDSchemeDefaultAccounts: [
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COMMISSION_PAID_ON,
            Group: 'Commission Paid On RD',
            PAndLGroup: 'Commission Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: INTEREST_PAID_ON,
            Group: 'Interest Paid On RD',
            PAndLGroup: 'Interest Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COLLECTION_CHARGE_PAID_ON,
            Group: 'Collection Charges Paid On RD',
            PAndLGroup: 'Collection Charges Paid On Deposit',
        },
    ],
    FDSchemeDefaultAccounts: [
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COMMISSION_PAID_ON,
            Group: 'Commission Paid On FD',
            PAndLGroup: 'Commission Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: INTEREST_PAID_ON,
            Group: 'Interest Paid On FD',
            PAndLGroup: 'Interest Paid On Deposit',
        },
        {
            under_scheme: 'Provision',
            intermediate_text: INTEREST_PROVISION_ON,
            Group: 'Interest Provision On FD',
            PAndLGroup: 'Interest Payable On Deposit',
        },
        {
            under_scheme: 'Provision',
            intermediate_text: COMMISSION_PAYABLE_ON,
            Group: 'Commission Payable On FD',
            PAndLGroup: 'Commission Payable Paid On Deposit',
        },
    ],
    MISSchemeDefaultAccounts: [
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: COMMISSION_PAID_ON,
            Group: 'Commission Paid On MIS',
            PAndLGroup: 'Commission Paid On Deposit',
        },
        {
            under_scheme: 'Indirect Expenses',
            intermediate_text: INTEREST_PAID_ON,
            Group: 'Interest Paid On MIS',
            PAndLGroup: 'Interest Paid On Deposit',
        },
        {
            under_scheme: 'Provision',
            intermediate_text: INTEREST_PROVISION_ON,
            Group: 'Interest Provision On MIS',
            PAndLGroup: 'Interest Payable On Deposit',
        },
        {
            under_scheme: 'Provision',
            intermediate_text: COMMISSION_PAYABLE_ON,
            Group: 'Commission Payable On MIS',
            PAndLGroup: 'Commission Payable Paid On Deposit',
        },
    ],
    LoanSchemeDefaultAccount: [
        {
            under_scheme: 'Indirect Income',
            intermediate_text: INTEREST_RECEIVED_ON,
            Group: 'Interest Received On {{Loan}}',
            PAndLGroup: 'Interest Received On Loan',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: PRE_INTEREST_RECEIVED_ON,
            Group: 'Pre Interest Received On {{Loan}}',
            PAndLGroup: 'Pre Interest Received On Loan',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: PANEL_INTEREST_RECEIVED_ON,
            Group: 'Penal Interest Received On {{Loan}}',
            PAndLGroup: 'Penal Interest Received On Loan',
        },
        {
            under_scheme: 'Indirect Income',
            intermediate_text: TIME_OVER_INTEREST_ON,
            Group: 'Time Over Interest On {{Loan}}',
            PAndLGroup: 'Time Over Interest On Loan',
        },
    ],
};
