import { generateClient } from 'aws-amplify/api';
import { Material, Transaction } from './types';
import * as mutations from '@/graphql/mutations';
import * as queries from '@/graphql/queries';

// Create client lazily to ensure Amplify is configured first
let client: any = null;
function getClient() {
  if (!client) {
    client = generateClient();
  }
  return client;
}

// Material API Functions
export async function fetchMaterials(): Promise<Material[]> {
  try {
    const result = await getClient().graphql({
      query: queries.listMaterials
    });
    
    const items = result.data.listMaterials.items;
    return items.map((item: any) => ({
      ...item,
      storageEntries: JSON.parse(item.storageEntries || '[]')
    }));
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
}

export async function createMaterial(material: Omit<Material, 'id'>): Promise<Material | null> {
  try {
    const result = await getClient().graphql({
      query: mutations.createMaterial,
      variables: {
        input: {
          ...material,
          storageEntries: JSON.stringify(material.storageEntries)
        }
      }
    });
    
    const created = result.data.createMaterial;
    return {
      ...created,
      storageEntries: JSON.parse(created.storageEntries || '[]')
    };
  } catch (error) {
    console.error('Error creating material:', error);
    return null;
  }
}

export async function updateMaterial(material: Material): Promise<Material | null> {
  try {
    const result = await getClient().graphql({
      query: mutations.updateMaterial,
      variables: {
        input: {
          id: material.id,
          name: material.name,
          project: material.project,
          lotNumber: material.lotNumber,
          storageEntries: JSON.stringify(material.storageEntries),
          concentration: material.concentration,
          submissionDate: material.submissionDate,
          storageCondition: material.storageCondition,
          submittedVolume: material.submittedVolume,
          unit: material.unit,
          retainAmount: material.retainAmount,
          retainUnit: material.retainUnit,
          currentQuantity: material.currentQuantity,
          labelInfo: material.labelInfo,
          notes: material.notes
        }
      }
    });
    
    const updated = result.data.updateMaterial;
    return {
      ...updated,
      storageEntries: JSON.parse(updated.storageEntries || '[]')
    };
  } catch (error) {
    console.error('Error updating material:', error);
    return null;
  }
}

// Transaction API Functions
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const result = await getClient().graphql({
      query: queries.listTransactions
    });
    
    const items = result.data.listTransactions.items;
    return items.map((item: any) => ({
      ...item,
      storageEntries: JSON.parse(item.storageEntries || '[]')
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction | null> {
  try {
    const result = await getClient().graphql({
      query: mutations.createTransaction,
      variables: {
        input: {
          ...transaction,
          storageEntries: JSON.stringify(transaction.storageEntries),
          recordedAt: new Date().toISOString()
        }
      }
    });
    
    const created = result.data.createTransaction;
    return {
      ...created,
      storageEntries: JSON.parse(created.storageEntries || '[]')
    };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    await getClient().graphql({
      query: mutations.deleteTransaction,
      variables: {
        input: { id }
      }
    });
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return false;
  }
}