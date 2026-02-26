import { ActionListDTO } from '../qnatk/src';
// import { BranchActions } from './branch-actions';
// import { MemberActions } from './member-actions';
// import { SchemeActions } from './scheme-actions';
import { StaffActions } from './staff-actions';
// import { AccountActions } from './account-actions';
// import { LoanAccountExtraActions } from './loan-account-actions';
// import { PendingLoanAccountExtraActions } from './pending-loan-account-actions';
// import { ClosingActions } from './closing-actions';
// import { SavingAccountExtraActions } from './saving-account-actions';
// import { ItemActions } from './stock/item-actions';
// import { CategoryActions } from './stock/Category-actions';
// import { ContainerTypeAction } from './stock/container-type-actions';
// import { ContainerAction } from './stock/container-actions';
// import { ContainerRowAction } from './stock/container-row-actions';
// import { SupplierActions } from './memorandum/supplier-actions';
// import { DefaultAccountExtraActions } from './default-account-actions';
// import { BalanceSheetActions } from './balancesheet-actions';
// import { AgentCadreActions } from './agent-cadre-actions';
// import { ContentFileActions } from './contentfile-actions';
// import { AgentActions } from './agent-actions';
// import { DealerActions } from './dealer-actions';
// import { DocumentActions } from './Document-actions';
import { QEntityActionsActions } from '../qnatk/src/models/qentity-actions-actions';
// import { EmployeeActions } from './employee-actions';
// import { MemberInsuranceActions } from './member-insurance-actions';
// import { AccountDocumentsActions } from './Account-Document-actions';
// import { AgentGuarantorActions } from './agent-guarantor-actions';
// import { AccountGuarantorActions } from './account-guarantor-actions';
// import { AccountTransactionActions } from './account-transaction-actions';
// import { DepositAccountExtraActions } from './deposit-account-actions';
// import { StockTransactionActions } from './stock/stockTransaction-actions';
// import { BankActions } from './bank-actions';
// import { BankBranchActions } from './bank-branch-actions';
// import { ShareActions } from './share-actions';
// import { LegalCaseActions } from './legalcase-actions';
// import { LegalCaseHearingActions } from './legalcase-hearing-actions';
// import { SurrenderBikeAndLegalActions } from './BikeAndlegal-actions';
// import { CircularActions } from './circular-actions';
// import { PolicyActions } from './policy-actions';
// import { BranchGodownActions } from './branch-godown-actions';
// import { BhawaniConfigActions } from './bhawani-config-actions';
// import { MoActions } from './mo-actions';
// import { RoActions } from './ro-actions';
// import { TeleCallerActions } from './telecaller-actions';
// import { TeleCallerHistoryActions } from './telecaller-history-actions';
// import { MoAndRoActions } from './mo-and-ro-actions';
// import { MemorandumTransaction } from 'src/models/Memorandum/MemorandumTransaction';
// import { memorandumTranasctionActions } from './memorandum/memorandumTranasction-actions';
// import NocLog from 'src/models/NocLog';
// import { NocLogActions } from './noc-log-actions';
// import { AccountTransactionRow } from 'src/models/AccountTransactionRow';
// import { AccountTransactionRowActions } from './account-transaction-row-actions';
// import { AccountTransactionRequest } from 'src/models/AccountTransactionRequest';
// import { TransactionRequestActions } from './transaction-request-actions';
// import RoAccountAssociation from 'src/models/RoAccountAssociation';
// import { RoAssociationActions } from './ro-association-actions';
// import { MemorandumTransactionRow } from 'src/models/Memorandum/MemorandumTransactionRow';
// import { memorandumTransactionRowActions } from './memorandum/memorandumTranasction-row-actions';
// import { AgentReport } from 'src/models/AgentReport';
import { QRoleActions } from './qrole-actions';
import { ClientActions } from './client-actions';
import { Property } from 'src/model/Client/Property';
import { PropertyActions } from './property-actions';
import { State } from 'src/model/Client/State';
import { StateActions } from './state-actions';
import { City } from 'src/model/Client/City';
import { CitiesActions } from './city-action';
import { Tehsil } from 'src/model/Client/Tehsil';
import { TehsilActions } from './tehsil-action';
import { Village } from 'src/model/Client/Village';
import { VillageActions } from './village-actions';
import { Plan } from 'src/model/Client/Plan';
import { PropertyPlanActions } from './property-plan-actions';
// import Premium from 'src/models/Premium';
// import { PremiumActions } from './premium-actions';
// import { LegalAccountInfo } from 'src/models/Legal/LegalAccountInfo';
// import { LegalAccountInfoActions } from './legalcase-account-info-actions';
// import GstInwardTransactionRow from 'src/models/GstInwardTransactionRow';
// import { GSTInwardTransactionRowActions } from './gst-inward-transaction-row-actions';
// import { GSTInwardActions } from './gst-inward-actions';
// import { GSTInward } from 'src/models/GSTInward';
// import JointMember from 'src/models/JointMember';
// import { AccountJointMemberActions } from './Account-JointMember-actions';
// import AgentTDS from 'src/models/AgentTDS';
// import { AgentTDSActions } from './agent-tds-actions';
// import xLog from 'src/models/xLog';
// import { XLogActions } from './xlog-actions';
// import StockSupplier from 'src/models/Stock/StockSupplier';
// import { StockSupplierActions } from './stock/stock-supplier-actions';
// import EmployeeLeaveRequest from 'src/models/EmployeeLeaveRequest';
// import { EmployeeLeaveRequestActions } from './employee-leave-request-actions';

export const ModelActions: Record<string, ActionListDTO> = {
  QEntityActions: QEntityActionsActions,
  // Member: MemberActions,
  Staff: StaffActions,
  QRoles: QRoleActions,
  Client: ClientActions,
  Property: PropertyActions,
  State: StateActions,
  City: CitiesActions,
  Tehsil: TehsilActions,
  Village: VillageActions,
  Plan: PropertyPlanActions,
  // BalanceSheet: BalanceSheetActions,
  // Branch: BranchActions,
  // AgentCadre: AgentCadreActions,
  // ContentFile: ContentFileActions,
  // Scheme: SchemeActions,
  // DDSScheme: SchemeActions,
  // SavingScheme: SchemeActions,
  // CurrentScheme: SchemeActions,
  // FDScheme: SchemeActions,
  // MisScheme: SchemeActions,
  // LoanScheme: SchemeActions,
  // DefaultScheme: SchemeActions,
  // RDScheme: SchemeActions,
  // SMAccount: AccountActions,
  // Account: AccountActions,
  // DefaultAccount: { ...AccountActions, ...DefaultAccountExtraActions },
  // SavingAccount: { ...AccountActions, ...SavingAccountExtraActions },
  // CurrentAccount: AccountActions,
  // RDAccount: { ...AccountActions, ...DepositAccountExtraActions },
  // DDSAccount: { ...AccountActions, ...DepositAccountExtraActions },
  // FDAccount: { ...AccountActions, ...DepositAccountExtraActions },
  // MISAccount: { ...AccountActions, ...DepositAccountExtraActions },
  // LoanAccount: { ...AccountActions, ...LoanAccountExtraActions },
  // PendingLoanAccount: {
  //     ...AccountActions,
  //     ...PendingLoanAccountExtraActions,
  // },
  // Closing: ClosingActions,
  // //Stock Actions
  // Items: ItemActions,
  // Category: CategoryActions,
  // ContainerType: ContainerTypeAction,
  // Container: ContainerAction,
  // ContainerRow: ContainerRowAction,
  // StockTransaction: StockTransactionActions,
  // // StockMember: StockMemberActions,
  // // Memorandum Actions
  // Supplier: SupplierActions,
  // Agent: AgentActions,
  // Dealer: DealerActions,
  // Document: DocumentActions,
  // AccountDocuments: AccountDocumentsActions,
  // Employee: EmployeeActions,
  // MemberInsurance: MemberInsuranceActions,
  // AgentGuarantor: AgentGuarantorActions,
  // AccountGuarantors: AccountGuarantorActions,
  // AccountTransaction: AccountTransactionActions,
  // Bank: BankActions,
  // BankBranch: BankBranchActions,
  // Share: ShareActions,
  // LegalCase: LegalCaseActions,
  // LegalCaseHearing: LegalCaseHearingActions,
  // BikeLegal: SurrenderBikeAndLegalActions,
  // Circular: CircularActions,
  // Policy: PolicyActions,
  // Godown: BranchGodownActions,
  // BhawaniConfig: BhawaniConfigActions,
  // MoAndRo: MoAndRoActions,
  // Mo: { ...MoAndRoActions, ...MoActions },
  // Ro: { ...MoAndRoActions, ...RoActions },
  // TeleCaller: TeleCallerActions,
  // TeleCallerAccountHistory: TeleCallerHistoryActions,
  // MemorandumTransaction: memorandumTranasctionActions,
  // MemorandumTransactionRow: memorandumTransactionRowActions,
  // NocLog: NocLogActions,
  // AccountTransactionRow: AccountTransactionRowActions,
  // AccountTransactionRequest: TransactionRequestActions,
  // RoAccountAssociation: RoAssociationActions,
  // AgentReport: { ...AgentActions },
  // Premium: PremiumActions,
  // LegalAccountInfo: LegalAccountInfoActions,
  // GstInwardTransactionRow: GSTInwardTransactionRowActions,
  // GSTInward: GSTInwardActions,
  // JointMember: AccountJointMemberActions,
  // AgentTDS: AgentTDSActions,
  // xLog: XLogActions,
  // StockSupplier: StockSupplierActions,
  // EmployeeLeaveRequest: EmployeeLeaveRequestActions,
};
