/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createMaterial = /* GraphQL */ `mutation CreateMaterial(
  $input: CreateMaterialInput!
  $condition: ModelMaterialConditionInput
) {
  createMaterial(input: $input, condition: $condition) {
    id
    name
    project
    lotNumber
    storageEntries
    concentration
    submissionDate
    storageCondition
    submittedVolume
    unit
    retainAmount
    retainUnit
    currentQuantity
    labelInfo
    notes
    transactions {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMaterialMutationVariables,
  APITypes.CreateMaterialMutation
>;
export const updateMaterial = /* GraphQL */ `mutation UpdateMaterial(
  $input: UpdateMaterialInput!
  $condition: ModelMaterialConditionInput
) {
  updateMaterial(input: $input, condition: $condition) {
    id
    name
    project
    lotNumber
    storageEntries
    concentration
    submissionDate
    storageCondition
    submittedVolume
    unit
    retainAmount
    retainUnit
    currentQuantity
    labelInfo
    notes
    transactions {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMaterialMutationVariables,
  APITypes.UpdateMaterialMutation
>;
export const deleteMaterial = /* GraphQL */ `mutation DeleteMaterial(
  $input: DeleteMaterialInput!
  $condition: ModelMaterialConditionInput
) {
  deleteMaterial(input: $input, condition: $condition) {
    id
    name
    project
    lotNumber
    storageEntries
    concentration
    submissionDate
    storageCondition
    submittedVolume
    unit
    retainAmount
    retainUnit
    currentQuantity
    labelInfo
    notes
    transactions {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMaterialMutationVariables,
  APITypes.DeleteMaterialMutation
>;
export const createTransaction = /* GraphQL */ `mutation CreateTransaction(
  $input: CreateTransactionInput!
  $condition: ModelTransactionConditionInput
) {
  createTransaction(input: $input, condition: $condition) {
    id
    materialId
    materialName
    lotNumber
    type
    quantity
    unit
    timestamp
    recordedAt
    recipient
    storageEntries
    notes
    material {
      id
      name
      project
      lotNumber
      storageEntries
      concentration
      submissionDate
      storageCondition
      submittedVolume
      unit
      retainAmount
      retainUnit
      currentQuantity
      labelInfo
      notes
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTransactionMutationVariables,
  APITypes.CreateTransactionMutation
>;
export const updateTransaction = /* GraphQL */ `mutation UpdateTransaction(
  $input: UpdateTransactionInput!
  $condition: ModelTransactionConditionInput
) {
  updateTransaction(input: $input, condition: $condition) {
    id
    materialId
    materialName
    lotNumber
    type
    quantity
    unit
    timestamp
    recordedAt
    recipient
    storageEntries
    notes
    material {
      id
      name
      project
      lotNumber
      storageEntries
      concentration
      submissionDate
      storageCondition
      submittedVolume
      unit
      retainAmount
      retainUnit
      currentQuantity
      labelInfo
      notes
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTransactionMutationVariables,
  APITypes.UpdateTransactionMutation
>;
export const deleteTransaction = /* GraphQL */ `mutation DeleteTransaction(
  $input: DeleteTransactionInput!
  $condition: ModelTransactionConditionInput
) {
  deleteTransaction(input: $input, condition: $condition) {
    id
    materialId
    materialName
    lotNumber
    type
    quantity
    unit
    timestamp
    recordedAt
    recipient
    storageEntries
    notes
    material {
      id
      name
      project
      lotNumber
      storageEntries
      concentration
      submissionDate
      storageCondition
      submittedVolume
      unit
      retainAmount
      retainUnit
      currentQuantity
      labelInfo
      notes
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTransactionMutationVariables,
  APITypes.DeleteTransactionMutation
>;
