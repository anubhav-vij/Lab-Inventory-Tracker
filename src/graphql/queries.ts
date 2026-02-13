/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getMaterial = /* GraphQL */ `query GetMaterial($id: ID!) {
  getMaterial(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMaterialQueryVariables,
  APITypes.GetMaterialQuery
>;
export const listMaterials = /* GraphQL */ `query ListMaterials(
  $filter: ModelMaterialFilterInput
  $limit: Int
  $nextToken: String
) {
  listMaterials(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMaterialsQueryVariables,
  APITypes.ListMaterialsQuery
>;
export const getTransaction = /* GraphQL */ `query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTransactionQueryVariables,
  APITypes.GetTransactionQuery
>;
export const listTransactions = /* GraphQL */ `query ListTransactions(
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTransactionsQueryVariables,
  APITypes.ListTransactionsQuery
>;
export const transactionsByMaterialIdAndTimestamp = /* GraphQL */ `query TransactionsByMaterialIdAndTimestamp(
  $materialId: ID!
  $timestamp: ModelStringKeyConditionInput
  $sortDirection: ModelSortDirection
  $filter: ModelTransactionFilterInput
  $limit: Int
  $nextToken: String
) {
  transactionsByMaterialIdAndTimestamp(
    materialId: $materialId
    timestamp: $timestamp
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.TransactionsByMaterialIdAndTimestampQueryVariables,
  APITypes.TransactionsByMaterialIdAndTimestampQuery
>;
