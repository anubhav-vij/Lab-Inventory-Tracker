/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateMaterial = /* GraphQL */ `subscription OnCreateMaterial($filter: ModelSubscriptionMaterialFilterInput) {
  onCreateMaterial(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateMaterialSubscriptionVariables,
  APITypes.OnCreateMaterialSubscription
>;
export const onUpdateMaterial = /* GraphQL */ `subscription OnUpdateMaterial($filter: ModelSubscriptionMaterialFilterInput) {
  onUpdateMaterial(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateMaterialSubscriptionVariables,
  APITypes.OnUpdateMaterialSubscription
>;
export const onDeleteMaterial = /* GraphQL */ `subscription OnDeleteMaterial($filter: ModelSubscriptionMaterialFilterInput) {
  onDeleteMaterial(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteMaterialSubscriptionVariables,
  APITypes.OnDeleteMaterialSubscription
>;
export const onCreateTransaction = /* GraphQL */ `subscription OnCreateTransaction(
  $filter: ModelSubscriptionTransactionFilterInput
) {
  onCreateTransaction(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTransactionSubscriptionVariables,
  APITypes.OnCreateTransactionSubscription
>;
export const onUpdateTransaction = /* GraphQL */ `subscription OnUpdateTransaction(
  $filter: ModelSubscriptionTransactionFilterInput
) {
  onUpdateTransaction(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTransactionSubscriptionVariables,
  APITypes.OnUpdateTransactionSubscription
>;
export const onDeleteTransaction = /* GraphQL */ `subscription OnDeleteTransaction(
  $filter: ModelSubscriptionTransactionFilterInput
) {
  onDeleteTransaction(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTransactionSubscriptionVariables,
  APITypes.OnDeleteTransactionSubscription
>;
