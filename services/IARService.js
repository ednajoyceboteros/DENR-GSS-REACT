import { supabase } from '../lib/supabaseClient';

/**
 * Submit IAR with purchase order and items via Edge Function
 * @param {Object} iarData - IAR form data
 * @param {File} backupFile - Optional backup file upload
 * @returns {Promise} Response from edge function
 */
export async function submitIAR(iarData, backupFile = null) {
  try {
    // Prepare backup file if exists
    let backupPayload = null;
    if (backupFile) {
      const base64Data = await fileToBase64(backupFile);
      backupPayload = {
        base64Data: base64Data.split(',')[1], // Remove data:mime;base64, prefix
        fileName: backupFile.name,
        contentType: backupFile.type
      };
    }

    // Call Edge Function
    const { data, error } = await supabase.functions.invoke(
      'ensure-po-and-create-iar',
      {
        body: {
          iar_number: iarData.iar_number,
          iar_date: iarData.iar_date,
          po_number: iarData.po_number,
          po_date: iarData.po_date,
          supplier_id: iarData.supplier_id,
          supplier_name: iarData.supplier_name,
          items: iarData.items.map(item => ({
            item_number: item.item_number,
            uacs_code: item.uacs_code,
            description: item.description,
            unit: item.unit,
            quantity: parseFloat(item.quantity),
            unit_cost: parseFloat(item.unit_cost),
            total_cost: parseFloat(item.total_cost)
          })),
          is_complete: iarData.is_complete,
          partial_details: iarData.partial_details,
          backup_file: backupPayload
        }
      }
    );

    if (error) throw error;

    console.log('IAR created successfully:', data);
    return data;

  } catch (error) {
    console.error('Error submitting IAR:', error);
    throw error;
  }
}

/**
 * Helper function to convert file to base64
 * @param {File} file - File object to convert
 * @returns {Promise<string>} Base64 string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}