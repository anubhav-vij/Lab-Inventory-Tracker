/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMaterialInput = {
  id?: string | null,
  name: string,
  project: string,
  lotNumber: string,
  storageEntries: string,
  concentration?: string | null,
  submissionDate: string,
  storageCondition: string,
  submittedVolume: number,
  unit: string,
  retainAmount: number,
  retainUnit: string,
  currentQuantity: number,
  labelInfo?: string | null,
  notes?: string | null,
};

export type ModelMaterialConditionInput = {
  name?: ModelStringInput | null,
  project?: ModelStringInput | null,
  lotNumber?: ModelStringInput | null,
  storageEntries?: ModelStringInput | null,
  concentration?: ModelStringInput | null,
  submissionDate?: ModelStringInput | null,
  storageCondition?: ModelStringInput | null,
  submittedVolume?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  retainAmount?: ModelFloatInput | null,
  retainUnit?: ModelStringInput | null,
  currentQuantity?: ModelFloatInput | null,
  labelInfo?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  and?: Array< ModelMaterialConditionInput | null > | null,
  or?: Array< ModelMaterialConditionInput | null > | null,
  not?: ModelMaterialConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Material = {
  __typename: "Material",
  id: string,
  name: string,
  project: string,
  lotNumber: string,
  storageEntries: string,
  concentration?: string | null,
  submissionDate: string,
  storageCondition: string,
  submittedVolume: number,
  unit: string,
  retainAmount: number,
  retainUnit: string,
  currentQuantity: number,
  labelInfo?: string | null,
  notes?: string | null,
  transactions?: ModelTransactionConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelTransactionConnection = {
  __typename: "ModelTransactionConnection",
  items:  Array<Transaction | null >,
  nextToken?: string | null,
};

export type Transaction = {
  __typename: "Transaction",
  id: string,
  materialId: string,
  materialName: string,
  lotNumber: string,
  type: string,
  quantity: number,
  unit: string,
  timestamp: string,
  recordedAt: string,
  recipient?: string | null,
  storageEntries: string,
  notes?: string | null,
  material?: Material | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateMaterialInput = {
  id: string,
  name?: string | null,
  project?: string | null,
  lotNumber?: string | null,
  storageEntries?: string | null,
  concentration?: string | null,
  submissionDate?: string | null,
  storageCondition?: string | null,
  submittedVolume?: number | null,
  unit?: string | null,
  retainAmount?: number | null,
  retainUnit?: string | null,
  currentQuantity?: number | null,
  labelInfo?: string | null,
  notes?: string | null,
};

export type DeleteMaterialInput = {
  id: string,
};

export type CreateTransactionInput = {
  id?: string | null,
  materialId: string,
  materialName: string,
  lotNumber: string,
  type: string,
  quantity: number,
  unit: string,
  timestamp: string,
  recordedAt: string,
  recipient?: string | null,
  storageEntries: string,
  notes?: string | null,
};

export type ModelTransactionConditionInput = {
  materialId?: ModelIDInput | null,
  materialName?: ModelStringInput | null,
  lotNumber?: ModelStringInput | null,
  type?: ModelStringInput | null,
  quantity?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  recordedAt?: ModelStringInput | null,
  recipient?: ModelStringInput | null,
  storageEntries?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  and?: Array< ModelTransactionConditionInput | null > | null,
  or?: Array< ModelTransactionConditionInput | null > | null,
  not?: ModelTransactionConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdateTransactionInput = {
  id: string,
  materialId?: string | null,
  materialName?: string | null,
  lotNumber?: string | null,
  type?: string | null,
  quantity?: number | null,
  unit?: string | null,
  timestamp?: string | null,
  recordedAt?: string | null,
  recipient?: string | null,
  storageEntries?: string | null,
  notes?: string | null,
};

export type DeleteTransactionInput = {
  id: string,
};

export type ModelMaterialFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  project?: ModelStringInput | null,
  lotNumber?: ModelStringInput | null,
  storageEntries?: ModelStringInput | null,
  concentration?: ModelStringInput | null,
  submissionDate?: ModelStringInput | null,
  storageCondition?: ModelStringInput | null,
  submittedVolume?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  retainAmount?: ModelFloatInput | null,
  retainUnit?: ModelStringInput | null,
  currentQuantity?: ModelFloatInput | null,
  labelInfo?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMaterialFilterInput | null > | null,
  or?: Array< ModelMaterialFilterInput | null > | null,
  not?: ModelMaterialFilterInput | null,
};

export type ModelMaterialConnection = {
  __typename: "ModelMaterialConnection",
  items:  Array<Material | null >,
  nextToken?: string | null,
};

export type ModelTransactionFilterInput = {
  id?: ModelIDInput | null,
  materialId?: ModelIDInput | null,
  materialName?: ModelStringInput | null,
  lotNumber?: ModelStringInput | null,
  type?: ModelStringInput | null,
  quantity?: ModelFloatInput | null,
  unit?: ModelStringInput | null,
  timestamp?: ModelStringInput | null,
  recordedAt?: ModelStringInput | null,
  recipient?: ModelStringInput | null,
  storageEntries?: ModelStringInput | null,
  notes?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelTransactionFilterInput | null > | null,
  or?: Array< ModelTransactionFilterInput | null > | null,
  not?: ModelTransactionFilterInput | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionMaterialFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  project?: ModelSubscriptionStringInput | null,
  lotNumber?: ModelSubscriptionStringInput | null,
  storageEntries?: ModelSubscriptionStringInput | null,
  concentration?: ModelSubscriptionStringInput | null,
  submissionDate?: ModelSubscriptionStringInput | null,
  storageCondition?: ModelSubscriptionStringInput | null,
  submittedVolume?: ModelSubscriptionFloatInput | null,
  unit?: ModelSubscriptionStringInput | null,
  retainAmount?: ModelSubscriptionFloatInput | null,
  retainUnit?: ModelSubscriptionStringInput | null,
  currentQuantity?: ModelSubscriptionFloatInput | null,
  labelInfo?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMaterialFilterInput | null > | null,
  or?: Array< ModelSubscriptionMaterialFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTransactionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  materialId?: ModelSubscriptionIDInput | null,
  materialName?: ModelSubscriptionStringInput | null,
  lotNumber?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  quantity?: ModelSubscriptionFloatInput | null,
  unit?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionStringInput | null,
  recordedAt?: ModelSubscriptionStringInput | null,
  recipient?: ModelSubscriptionStringInput | null,
  storageEntries?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionTransactionFilterInput | null > | null,
  or?: Array< ModelSubscriptionTransactionFilterInput | null > | null,
};

export type CreateMaterialMutationVariables = {
  input: CreateMaterialInput,
  condition?: ModelMaterialConditionInput | null,
};

export type CreateMaterialMutation = {
  createMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMaterialMutationVariables = {
  input: UpdateMaterialInput,
  condition?: ModelMaterialConditionInput | null,
};

export type UpdateMaterialMutation = {
  updateMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMaterialMutationVariables = {
  input: DeleteMaterialInput,
  condition?: ModelMaterialConditionInput | null,
};

export type DeleteMaterialMutation = {
  deleteMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTransactionMutationVariables = {
  input: CreateTransactionInput,
  condition?: ModelTransactionConditionInput | null,
};

export type CreateTransactionMutation = {
  createTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTransactionMutationVariables = {
  input: UpdateTransactionInput,
  condition?: ModelTransactionConditionInput | null,
};

export type UpdateTransactionMutation = {
  updateTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTransactionMutationVariables = {
  input: DeleteTransactionInput,
  condition?: ModelTransactionConditionInput | null,
};

export type DeleteTransactionMutation = {
  deleteTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetMaterialQueryVariables = {
  id: string,
};

export type GetMaterialQuery = {
  getMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMaterialsQueryVariables = {
  filter?: ModelMaterialFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMaterialsQuery = {
  listMaterials?:  {
    __typename: "ModelMaterialConnection",
    items:  Array< {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTransactionQueryVariables = {
  id: string,
};

export type GetTransactionQuery = {
  getTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTransactionsQueryVariables = {
  filter?: ModelTransactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTransactionsQuery = {
  listTransactions?:  {
    __typename: "ModelTransactionConnection",
    items:  Array< {
      __typename: "Transaction",
      id: string,
      materialId: string,
      materialName: string,
      lotNumber: string,
      type: string,
      quantity: number,
      unit: string,
      timestamp: string,
      recordedAt: string,
      recipient?: string | null,
      storageEntries: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type TransactionsByMaterialIdAndTimestampQueryVariables = {
  materialId: string,
  timestamp?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelTransactionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type TransactionsByMaterialIdAndTimestampQuery = {
  transactionsByMaterialIdAndTimestamp?:  {
    __typename: "ModelTransactionConnection",
    items:  Array< {
      __typename: "Transaction",
      id: string,
      materialId: string,
      materialName: string,
      lotNumber: string,
      type: string,
      quantity: number,
      unit: string,
      timestamp: string,
      recordedAt: string,
      recipient?: string | null,
      storageEntries: string,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMaterialSubscriptionVariables = {
  filter?: ModelSubscriptionMaterialFilterInput | null,
};

export type OnCreateMaterialSubscription = {
  onCreateMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMaterialSubscriptionVariables = {
  filter?: ModelSubscriptionMaterialFilterInput | null,
};

export type OnUpdateMaterialSubscription = {
  onUpdateMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMaterialSubscriptionVariables = {
  filter?: ModelSubscriptionMaterialFilterInput | null,
};

export type OnDeleteMaterialSubscription = {
  onDeleteMaterial?:  {
    __typename: "Material",
    id: string,
    name: string,
    project: string,
    lotNumber: string,
    storageEntries: string,
    concentration?: string | null,
    submissionDate: string,
    storageCondition: string,
    submittedVolume: number,
    unit: string,
    retainAmount: number,
    retainUnit: string,
    currentQuantity: number,
    labelInfo?: string | null,
    notes?: string | null,
    transactions?:  {
      __typename: "ModelTransactionConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTransactionSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionFilterInput | null,
};

export type OnCreateTransactionSubscription = {
  onCreateTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTransactionSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionFilterInput | null,
};

export type OnUpdateTransactionSubscription = {
  onUpdateTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTransactionSubscriptionVariables = {
  filter?: ModelSubscriptionTransactionFilterInput | null,
};

export type OnDeleteTransactionSubscription = {
  onDeleteTransaction?:  {
    __typename: "Transaction",
    id: string,
    materialId: string,
    materialName: string,
    lotNumber: string,
    type: string,
    quantity: number,
    unit: string,
    timestamp: string,
    recordedAt: string,
    recipient?: string | null,
    storageEntries: string,
    notes?: string | null,
    material?:  {
      __typename: "Material",
      id: string,
      name: string,
      project: string,
      lotNumber: string,
      storageEntries: string,
      concentration?: string | null,
      submissionDate: string,
      storageCondition: string,
      submittedVolume: number,
      unit: string,
      retainAmount: number,
      retainUnit: string,
      currentQuantity: number,
      labelInfo?: string | null,
      notes?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
