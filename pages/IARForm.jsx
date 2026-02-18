import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { supabase } from '../lib/supabaseClient';
import { submitIAR } from '../services/iarService';
import '../styles/IARFORM.css';

export default function IarForm() {
  const [selectedOffices, setSelectedOffices] = useState([]);
  const [officeDropdownOpen, setOfficeDropdownOpen] = useState(false);
  const [officeSearchTerm, setOfficeSearchTerm] = useState('');
  const [supplier, setSupplier] = useState('');
  const [otherSupplier, setOtherSupplier] = useState('');
  const [isComplete, setIsComplete] = useState(true);
  const [isPartial, setIsPartial] = useState(false);
  const [officeItems, setOfficeItems] = useState({});
  const [uacsDropdownOpen, setUacsDropdownOpen] = useState({});
  const [uacsSearchTerms, setUacsSearchTerms] = useState({});

  const navigate = useNavigate();

  const hasChildren = (officeId) => offices.some(o => o.parent === officeId);

  const [backupFile, setBackupFile] = useState(null);

  const officeDropdownRef = useRef(null);
  const uacsDropdownRefs = useRef({});

  const offices = [
    { id: 'AD', name: 'Administrative Division', parent: null },
    { id: 'AD-CU', name: 'Cashiering Unit', parent: 'AD' },
    { id: 'AD-GSS', name: 'General Services Section', parent: 'AD' },
    { id: 'AD-HRD', name: 'HRD Section', parent: 'AD' },
    { id: 'AD-PS', name: 'Personnel Section', parent: 'AD' },
    { id: 'AD-PROC', name: 'Procurement Section', parent: 'AD' },
    { id: 'AD-RU', name: 'Records Unit', parent: 'AD' },
    { id: 'ARDMS', name: 'ARD for Management Services', parent: null },
    { id: 'ARDTS', name: 'ARD for Technical Services', parent: null },
    { id: 'CDD', name: 'Conservation Development Division (CDD)', parent: null },
    { id: 'ED', name: 'Enforcement Division', parent: null },
    { id: 'FD', name: 'Finance Division', parent: null },
    { id: 'LD', name: 'Legal Division', parent: null },
    { id: 'LPDD', name: 'Licenses, Patents & Deeds Division (LPDD)', parent: null },
    { id: 'NGP', name: 'National Greening Program (NGP)', parent: null },
    { id: 'PMS', name: 'Planning and Management Section', parent: null },
    { id: 'SMD', name: 'Surveys Mapping Division', parent: null },
  ];

  const uacsCategories = [
    {
      category: 'Office Supplies',
      items: [
        { code: '5-02-01-010', name: 'Office Supplies Expenses' },
        { code: '5-02-01-011', name: 'Accounting & Cashiering Supplies' },
        { code: '5-02-01-012', name: 'Office Equipment Supplies' },
      ]
    },
    {
      category: 'ICT Equipment',
      items: [
        { code: '5-06-03-010', name: 'ICT Equipment' },
        { code: '5-06-03-011', name: 'Computer Software' },
        { code: '5-06-03-012', name: 'Computer Hardware' },
      ]
    },
    {
      category: 'Furniture & Fixtures',
      items: [
        { code: '5-06-01-010', name: 'Furniture & Fixtures' },
        { code: '5-06-01-011', name: 'Office Furniture' },
        { code: '5-06-01-012', name: 'Other Furniture' },
      ]
    },
    {
      category: 'Machinery & Equipment',
      items: [
        { code: '5-06-04-010', name: 'Machinery' },
        { code: '5-06-04-011', name: 'Technical & Scientific Equipment' },
        { code: '5-06-04-012', name: 'Other Machinery & Equipment' },
      ]
    },
  ];

  const itemsWithDescriptions = {
    'Bond Paper': [
      'A4 Size, 70gsm',
      'A4 Size, 80gsm',
      'Letter Size, 70gsm',
      'Letter Size, 80gsm',
      'Legal Size, 70gsm',
      'Legal Size, 80gsm',
      'Short, 70gsm',
      'Long, 80gsm',
      'Colored A4',
      'Colored Letter',
      'Others (Please Specify)',
    ],
    'Ballpen': [
      'Blue',
      'Black',
      'Red',
      'Green',
      'Blue, 12 pcs/box',
      'Black, 12 pcs/box',
      'Red, 12 pcs/box',
      'Assorted Colors',
      'Retractable',
      'Stick Type',
      'Others (Please Specify)',
    ],
    'Folder': [
      'Short',
      'Long',
      'Colored',
      'Plastic Long',
      'Plastic Short',
      'Expandable',
      'With Fastener',
      'Plain',
      'Pressboard',
      'Others (Please Specify)',
    ],
    'Envelope': [
      'Short',
      'Long',
      'Brown Short',
      'Brown Long',
      'White Short',
      'White Long',
      'With Window',
      'Mailing Envelope',
      'Documentary Envelope',
      'Others (Please Specify)',
    ],
    'Stapler': [
      'Standard',
      'Heavy Duty',
      'Small',
      'Medium',
      'Large',
      'Desktop',
      'Portable',
      'Metal',
      'Plastic',
      'Others (Please Specify)',
    ],
    'Staple Wire': [
      'Standard #10',
      'Standard #35',
      'Heavy Duty #23',
      'Heavy Duty #13',
      'Small',
      'Medium',
      'Large',
      '1000 pcs/box',
      '5000 pcs/box',
      'Others (Please Specify)',
    ],
    'Paper Clip': [
      'Standard',
      'Jumbo',
      'Small',
      'Medium',
      'Large',
      'Colored',
      'Plain',
      '100 pcs/box',
      '500 pcs/box',
      'Others (Please Specify)',
    ],
    'Binder Clip': [
      'Small (19mm)',
      'Medium (25mm)',
      'Large (32mm)',
      'Extra Large (41mm)',
      'Assorted Sizes',
      'Black',
      'Colored',
      '12 pcs/box',
      'Others (Please Specify)',
    ],
    'Correction Tape': [
      'Standard',
      'Mini',
      'Long Lasting',
      '5mm x 8m',
      '5mm x 12m',
      'Refillable',
      'Disposable',
      'White',
      'Others (Please Specify)',
    ],
    'Marker': [
      'Permanent Black',
      'Permanent Blue',
      'Permanent Red',
      'Whiteboard Black',
      'Whiteboard Blue',
      'Whiteboard Red',
      'Whiteboard Assorted',
      'Fine Tip',
      'Broad Tip',
      'Chisel Tip',
      'Others (Please Specify)',
    ],
    'Highlighter': [
      'Yellow',
      'Orange',
      'Pink',
      'Green',
      'Blue',
      'Assorted Colors',
      'Pastel Colors',
      'Set of 4',
      'Set of 6',
      'Others (Please Specify)',
    ],
    'Notebook': [
      'Short',
      'Long',
      'Spiral Short',
      'Spiral Long',
      'Composition',
      'Stenographer',
      '80 pages',
      '100 pages',
      'With Cover',
      'Plain',
      'Others (Please Specify)',
    ],
    'Sticky Notes': [
      'Small (3x3)',
      'Medium (3x5)',
      'Large (4x6)',
      'Yellow',
      'Assorted Colors',
      'Neon Colors',
      'Pastel Colors',
      'Cube Type',
      'Pad Type',
      'Others (Please Specify)',
    ],
    'Calculator': [
      'Basic',
      'Scientific',
      'Desktop Size',
      'Pocket Size',
      '12-digit',
      '8-digit',
      'Solar Powered',
      'Battery Operated',
      'Dual Power',
      'Others (Please Specify)',
    ],
    'Scissors': [
      'Small (5 inches)',
      'Medium (7 inches)',
      'Large (8 inches)',
      'Stainless Steel',
      'Plastic Handle',
      'Rubber Grip',
      'Pointed Tip',
      'Round Tip',
      'Others (Please Specify)',
    ],
    'Tape Dispenser': [
      'Desktop',
      'Handheld',
      'Small',
      'Medium',
      'Large',
      'Heavy Duty',
      'Plastic',
      'Metal',
      'With Tape',
      'Without Tape',
      'Others (Please Specify)',
    ],
    'Puncher': [
      'Standard 2-hole',
      'Heavy Duty 2-hole',
      'Small (10 sheets)',
      'Medium (20 sheets)',
      'Large (50 sheets)',
      'Extra Large (100 sheets)',
      'Metal',
      'Plastic',
      'Adjustable',
      'Others (Please Specify)',
    ],
    'Printer Ink/Toner': [
      'Black',
      'Cyan',
      'Magenta',
      'Yellow',
      'Color Set (CMY)',
      'Complete Set (CMYK)',
      'Original',
      'Compatible',
      'High Yield',
      'Standard Yield',
      'Others (Please Specify)',
    ],
    'Computer Desktop': [
      'Intel Core i3',
      'Intel Core i5',
      'Intel Core i7',
      'AMD Ryzen 3',
      'AMD Ryzen 5',
      'AMD Ryzen 7',
      'With Monitor',
      'CPU Only',
      'Complete Set',
      'Others (Please Specify)',
    ],
    'Laptop': [
      'Intel Core i3',
      'Intel Core i5',
      'Intel Core i7',
      'AMD Ryzen 3',
      'AMD Ryzen 5',
      'AMD Ryzen 7',
      '14 inch',
      '15.6 inch',
      'With Bag',
      'Others (Please Specify)',
    ],
    'Printer': [
      'Inkjet',
      'Laser',
      'Monochrome',
      'Colored',
      'All-in-One',
      'Single Function',
      'A4 Size',
      'Legal Size',
      'Network Enabled',
      'USB Only',
      'Others (Please Specify)',
    ],
    'Scanner': [
      'Flatbed',
      'Sheet-fed',
      'Portable',
      'Desktop',
      'A4 Size',
      'Legal Size',
      'High Resolution',
      'Standard Resolution',
      'Network Enabled',
      'USB Only',
      'Others (Please Specify)',
    ],
    'Monitor': [
      '19 inch',
      '21 inch',
      '24 inch',
      '27 inch',
      'LED',
      'LCD',
      'Full HD',
      '4K',
      'Widescreen',
      'Standard',
      'Others (Please Specify)',
    ],
    'Keyboard': [
      'Standard',
      'Wireless',
      'Wired',
      'USB',
      'Bluetooth',
      'Mechanical',
      'Membrane',
      'Ergonomic',
      'Compact',
      'Full Size',
      'Others (Please Specify)',
    ],
    'Mouse': [
      'Optical',
      'Wireless',
      'Wired',
      'USB',
      'Bluetooth',
      'Standard Size',
      'Compact',
      'Ergonomic',
      '3-button',
      '5-button',
      'Others (Please Specify)',
    ],
    'Office Chair': [
      'Executive',
      'Clerical',
      'Visitor',
      'High Back',
      'Mid Back',
      'Low Back',
      'With Armrest',
      'Without Armrest',
      'Mesh',
      'Leather',
      'Fabric',
      'Others (Please Specify)',
    ],
    'Office Table': [
      'Executive',
      'Standard',
      'Computer Table',
      'Meeting Table',
      'Reception Desk',
      'L-shaped',
      'Rectangular',
      '4-feet',
      '5-feet',
      '6-feet',
      'Wood',
      'Metal',
      'Others (Please Specify)',
    ],
    'Filing Cabinet': [
      '2-drawer',
      '3-drawer',
      '4-drawer',
      'Lateral',
      'Vertical',
      'Mobile',
      'Stationary',
      'Steel',
      'Wood',
      'With Lock',
      'Without Lock',
      'Others (Please Specify)',
    ],
    'Bookshelf': [
      '3-layer',
      '4-layer',
      '5-layer',
      'Steel',
      'Wood',
      'Wall-mounted',
      'Free-standing',
      'With Glass Door',
      'Open Type',
      'Others (Please Specify)',
    ],
    'Air Conditioner': [
      'Window Type 0.5HP',
      'Window Type 0.75HP',
      'Window Type 1.0HP',
      'Window Type 1.5HP',
      'Window Type 2.0HP',
      'Split Type 0.75HP',
      'Split Type 1.0HP',
      'Split Type 1.5HP',
      'Split Type 2.0HP',
      'Inverter',
      'Non-Inverter',
      'Others (Please Specify)',
    ],
    'Electric Fan': [
      'Stand Fan 16"',
      'Stand Fan 18"',
      'Wall Fan 16"',
      'Wall Fan 18"',
      'Desk Fan 12"',
      'Desk Fan 16"',
      'Industrial Fan',
      'Ceiling Fan',
      'With Remote',
      'Without Remote',
      'Others (Please Specify)',
    ],
    'Others (Please Specify)': [
      'Others (Please Specify)',
    ],
  };

  const itemNames = Object.keys(itemsWithDescriptions);

  const filteredOffices = offices;

  const handleOfficeToggle = (officeId) => {
    if (selectedOffices.includes(officeId)) {
      // Remove office and its items
      setSelectedOffices(selectedOffices.filter(id => id !== officeId));
      const newOfficeItems = { ...officeItems };
      delete newOfficeItems[officeId];
      setOfficeItems(newOfficeItems);
    } else {
      // Add office
      setSelectedOffices([...selectedOffices, officeId]);
      // Initialize with one empty item
      if (!officeItems[officeId]) {
        setOfficeItems({
          ...officeItems,
          [officeId]: [createNewItem()]
        });
      }
    }
  };

  const createNewItem = () => ({
    id: Date.now() + Math.random(),
    uacsCode: '',
    category: '',
    itemName: '',
    customItemName: '',
    description: '',
    customDescription: '',
    unit: '',
    quantity: '',
    unitCost: '',
    stockNumber: '',
    stockSerialNumber: '',
    icsNumbers: [],
    icsSerialNumbers: [],
    propertyNumbers: [],
    propertySerialNumbers: [],
  });

  const handleAddItem = (officeId) => {
    setOfficeItems({
      ...officeItems,
      [officeId]: [...(officeItems[officeId] || []), createNewItem()]
    });
  };

  const handleRemoveItem = (officeId, itemId) => {
    setOfficeItems({
      ...officeItems,
      [officeId]: officeItems[officeId].filter(item => item.id !== itemId)
    });
  };

  const handleItemChange = (officeId, itemId, field, value) => {
    setOfficeItems({
      ...officeItems,
      [officeId]: officeItems[officeId].map(item => {
        if (item.id !== itemId) return item;
        
        const updatedItem = { ...item, [field]: value };
        
        // Clear description and custom item name when item name changes
        if (field === 'itemName') {
          updatedItem.description = '';
          updatedItem.customDescription = '';
          if (value !== 'Others (Please Specify)') {
            updatedItem.customItemName = '';
          }
        }
        
        // Clear custom description if switching away from "Others"
        if (field === 'description' && value !== 'Others (Please Specify)') {
          updatedItem.customDescription = '';
        }
        
        // If quantity changes, update tracking number arrays for ICS/Property
        if (field === 'quantity') {
          const qty = parseInt(value) || 0;
          const classification = getClassification(parseFloat(item.unitCost) || 0);
          
          if (classification === 'ICS') {
            // Resize ICS arrays
            updatedItem.icsNumbers = Array(qty).fill('').map((_, i) => item.icsNumbers[i] || '');
            updatedItem.icsSerialNumbers = Array(qty).fill('').map((_, i) => item.icsSerialNumbers[i] || '');
          } else if (classification === 'Property') {
            // Resize Property arrays
            updatedItem.propertyNumbers = Array(qty).fill('').map((_, i) => item.propertyNumbers[i] || '');
            updatedItem.propertySerialNumbers = Array(qty).fill('').map((_, i) => item.propertySerialNumbers[i] || '');
          }
        }
        
        // If unit cost changes, reset tracking numbers if classification changes
        if (field === 'unitCost') {
          const oldClassification = getClassification(parseFloat(item.unitCost) || 0);
          const newClassification = getClassification(parseFloat(value) || 0);
          
          if (oldClassification !== newClassification) {
            const qty = parseInt(item.quantity) || 0;
            if (newClassification === 'Stock') {
              updatedItem.stockNumber = '';
              updatedItem.stockSerialNumber = '';
              updatedItem.icsNumbers = [];
              updatedItem.icsSerialNumbers = [];
              updatedItem.propertyNumbers = [];
              updatedItem.propertySerialNumbers = [];
            } else if (newClassification === 'ICS') {
              updatedItem.stockNumber = '';
              updatedItem.stockSerialNumber = '';
              updatedItem.icsNumbers = Array(qty).fill('');
              updatedItem.icsSerialNumbers = Array(qty).fill('');
              updatedItem.propertyNumbers = [];
              updatedItem.propertySerialNumbers = [];
            } else if (newClassification === 'Property') {
              updatedItem.stockNumber = '';
              updatedItem.stockSerialNumber = '';
              updatedItem.icsNumbers = [];
              updatedItem.icsSerialNumbers = [];
              updatedItem.propertyNumbers = Array(qty).fill('');
              updatedItem.propertySerialNumbers = Array(qty).fill('');
            }
          }
        }
        
        return updatedItem;
      })
    });
  };

  const handleTrackingNumberChange = (officeId, itemId, field, index, value) => {
    setOfficeItems({
      ...officeItems,
      [officeId]: officeItems[officeId].map(item => {
        if (item.id !== itemId) return item;
        
        const updatedItem = { ...item };
        if (field === 'icsNumber') {
          updatedItem.icsNumbers = [...item.icsNumbers];
          updatedItem.icsNumbers[index] = value;
        } else if (field === 'icsSerial') {
          updatedItem.icsSerialNumbers = [...item.icsSerialNumbers];
          updatedItem.icsSerialNumbers[index] = value;
        } else if (field === 'propertyNumber') {
          updatedItem.propertyNumbers = [...item.propertyNumbers];
          updatedItem.propertyNumbers[index] = value;
        } else if (field === 'propertySerial') {
          updatedItem.propertySerialNumbers = [...item.propertySerialNumbers];
          updatedItem.propertySerialNumbers[index] = value;
        }
        
        return updatedItem;
      })
    });
  };

  const getClassification = (unitCost) => {
    if (unitCost >= 50000) return 'Property';
    if (unitCost >= 1000) return 'ICS';
    if (unitCost >= 0.01) return 'Stock';
    return 'Stock';
  };

  const getClassificationLabel = (classification) => {
    switch (classification) {
      case 'Stock':
        return 'Stock Card (₱0.01 - ₱999.99)';
      case 'ICS':
        return 'ICS (₱1,000 - ₱49,999.99)';
      case 'Property':
        return 'Property Card (₱50,000+)';
      default:
        return '';
    }
  };

  const handleUacsSelect = (officeId, itemId, uacs) => {
    setOfficeItems({
      ...officeItems,
      [officeId]: officeItems[officeId].map(item =>
        item.id === itemId 
          ? { ...item, uacsCode: uacs.code, category: uacs.name } 
          : item
      )
    });
    setUacsDropdownOpen({ ...uacsDropdownOpen, [`${officeId}-${itemId}`]: false });
    setUacsSearchTerms({ ...uacsSearchTerms, [`${officeId}-${itemId}`]: '' });
  };

  const handleCategorySelect = (officeId, itemId, uacs) => {
    setOfficeItems({
      ...officeItems,
      [officeId]: officeItems[officeId].map(item =>
        item.id === itemId 
          ? { ...item, category: uacs.name, uacsCode: uacs.code } 
          : item
      )
    });
    setUacsDropdownOpen({ ...uacsDropdownOpen, [`${officeId}-${itemId}-category`]: false });
    setUacsSearchTerms({ ...uacsSearchTerms, [`${officeId}-${itemId}-category`]: '' });
  };

  const handleSelectAll = () => {
    setSelectedOffices(offices.map(o => o.id));
    const newOfficeItems = {};
    offices.forEach(office => {
      if (!officeItems[office.id]) {
        newOfficeItems[office.id] = [createNewItem()];
      } else {
        newOfficeItems[office.id] = officeItems[office.id];
      }
    });
    setOfficeItems({ ...officeItems, ...newOfficeItems });
  };

  const handleClearAll = () => {
    setSelectedOffices([]);
    setOfficeItems({});
  };

  const handleCompleteChange = (e) => {
    if (e.target.checked) {
      setIsComplete(true);
      setIsPartial(false);
    }
  };

  const handlePartialChange = (e) => {
    if (e.target.checked) {
      setIsPartial(true);
      setIsComplete(false);
    } else {
      setIsPartial(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: Check required fields
    if (!document.getElementById('iarNumber')?.value) {
      alert('❌ IAR Number is required!');
      return;
    }
    
    if (!document.getElementById('iarDate')?.value) {
      alert('❌ IAR Date is required!');
      return;
    }
    
    if (selectedOffices.length === 0) {
      alert('❌ Please select at least one office!');
      return;
    }
    
    // Validate that each selected office has at least one item
    for (const officeId of selectedOffices) {
      if (!officeItems[officeId] || officeItems[officeId].length === 0) {
        const officeName = offices.find(o => o.id === officeId)?.name || officeId;
        alert(`❌ Please add at least one item for ${officeName}`);
        return;
      }
    }
    
    try {
      // ========================================
      // STEP 1: Handle Supplier (get or create supplier_id)
      // ========================================
      let supplierId = null;
      let supplierName = '';
      
      if (supplier && supplier !== 'none') {
        supplierName = supplier === 'others' ? otherSupplier : supplier;
        
        // Check if supplier exists
        const { data: existingSupplier, error: supplierFetchError } = await supabase
          .from('suppliers')
          .select('supplier_id')
          .eq('supplier_name', supplierName)
          .single();
        
        if (supplierFetchError && supplierFetchError.code !== 'PGRST116') {
          throw new Error(`Supplier lookup failed: ${supplierFetchError.message}`);
        }
        
        if (existingSupplier) {
          supplierId = existingSupplier.supplier_id;
        } else {
          // Create new supplier
          const { data: newSupplier, error: supplierInsertError } = await supabase
            .from('suppliers')
            .insert([{ supplier_name: supplierName }])
            .select('supplier_id')
            .single();
          
          if (supplierInsertError) {
            throw new Error(`Failed to create supplier: ${supplierInsertError.message}`);
          }
          
          supplierId = newSupplier.supplier_id;
        }
      }
      
      // ========================================
      // STEP 2: Transform office-based items into flat array
      // ========================================
      const flattenedItems = [];
      let itemNumber = 1;
      
      for (const officeId of selectedOffices) {
        const items = officeItems[officeId];
        const officeData = offices.find(o => o.id === officeId);
        
        for (const item of items) {
          const actualItemName = item.itemName === 'Others (Please Specify)' 
            ? item.customItemName 
            : item.itemName;
          
          const actualDescription = item.description === 'Others (Please Specify)' 
            ? item.customDescription 
            : item.description;
          
          const unitCost = parseFloat(item.unitCost) || 0;
          const quantity = parseFloat(item.quantity) || 0;
          
          flattenedItems.push({
            item_number: itemNumber++,
            office_id: officeId,
            office_name: officeData?.name || officeId,
            uacs_code: item.uacsCode || null,
            description: `${actualItemName} - ${actualDescription}`,
            item_name: actualItemName,
            item_description: actualDescription,
            unit: item.unit,
            quantity: quantity,
            unit_cost: unitCost,
            total_cost: quantity * unitCost,
            // Include tracking numbers for edge function to handle
            classification: getClassification(unitCost),
            stock_number: item.stockNumber || null,
            stock_serial_number: item.stockSerialNumber || null,
            ics_numbers: item.icsNumbers || [],
            ics_serial_numbers: item.icsSerialNumbers || [],
            property_numbers: item.propertyNumbers || [],
            property_serial_numbers: item.propertySerialNumbers || []
          });
        }
      }
      
      // ========================================
      // STEP 3: Call Edge Function
      // ========================================
      console.log('📤 Submitting IAR via Edge Function...');
      
      const result = await submitIAR({
        iar_number: document.getElementById('iarNumber').value.trim(),
        iar_date: document.getElementById('iarDate').value,
        po_number: document.getElementById('poNumber')?.value?.trim() || null,
        po_date: document.getElementById('poDate')?.value || null,
        supplier_id: supplierId,
        supplier_name: supplierName,
        
        // NEW FIELDS:
        billing_invoice: document.getElementById('billingInvoice')?.value?.trim() || null,
        invoice_date: document.getElementById('invoiceDate')?.value || null,
        delivery_receipt: document.getElementById('deliveryReceipt')?.value?.trim() || null,
        delivery_date: document.getElementById('deliveryDate')?.value || null,
        obligation_number: document.getElementById('obligationNumber')?.value?.trim() || null,
        obligation_date: document.getElementById('obligationDate')?.value || null,
        inspector_name: document.getElementById('inspectorName')?.value?.trim() || null,
        date_inspected: document.getElementById('dateInspected')?.value || null,
        supporting_docs: document.getElementById('supportingDocs')?.value || null,
        custodian_name: document.getElementById('custodianName')?.value?.trim() || null,
        date_received: document.getElementById('dateReceived')?.value || null,
        
        items: flattenedItems,
        is_complete: isComplete,
        partial_details: isPartial ? document.getElementById('partialDetails')?.value : null
      }, backupFile);
      
      // ========================================
      // STEP 4: Also store backup in iar_submissions for audit trail
      // ========================================
      const { error: backupError } = await supabase
        .from('iar_submissions')
        .insert([{
          iar_number: document.getElementById('iarNumber').value.trim(),
          iar_date: document.getElementById('iarDate').value,
          po_no: document.getElementById('poNumber')?.value?.trim() || null,
          po_date: document.getElementById('poDate')?.value || null,
          supplier: supplier === 'others' ? 'Other' : supplier,
          supplier_other: supplier === 'others' ? otherSupplier : null,
          is_complete: isComplete,
          is_partial: isPartial,
          partial_details: isPartial ? document.getElementById('partialDetails')?.value : null,
          selected_offices: selectedOffices,
          office_items: officeItems,
          supporting_docs: document.getElementById('supportingDocs')?.value || null,
          billing_invoice: document.getElementById('billingInvoice')?.value?.trim() || null,
          invoice_date: document.getElementById('invoiceDate')?.value || null,
          delivery_receipt: document.getElementById('deliveryReceipt')?.value?.trim() || null,
          delivery_date: document.getElementById('deliveryDate')?.value || null,
          obligation_number: document.getElementById('obligationNumber')?.value?.trim() || null,
          obligation_date: document.getElementById('obligationDate')?.value || null,
          inspector_name: document.getElementById('inspectorName')?.value?.trim() || null,
          date_inspected: document.getElementById('dateInspected')?.value || null,
          custodian_name: document.getElementById('custodianName')?.value?.trim() || null,
          date_received: document.getElementById('dateReceived')?.value || null,
        }]);
      
      if (backupError) {
        console.warn('⚠️ Backup to iar_submissions failed:', backupError);
        // Don't fail the whole submission for backup errors
      }
      
      // ========================================
      // SUCCESS!
      // ========================================
      console.log('✅ IAR submitted successfully via Edge Function!', result);
      alert(`✅ IAR Form submitted successfully!\n\nIAR Number: ${document.getElementById('iarNumber').value.trim()}\nDate: ${document.getElementById('iarDate').value}`);
      
      // Navigate back to landing page
      navigate('/iar-landing-page');
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      alert(`❌ Failed to save IAR!\n\nError: ${error.message}\n\nPlease try again or contact support.`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (officeDropdownRef.current && !officeDropdownRef.current.contains(event.target)) {
        setOfficeDropdownOpen(false);
      }
      
      // Close UACS and Category dropdowns
      Object.keys(uacsDropdownRefs.current).forEach(key => {
        if (uacsDropdownRefs.current[key] && !uacsDropdownRefs.current[key].contains(event.target)) {
          setUacsDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSelectedOfficesText = () => {
    if (selectedOffices.length === 0) return 'Select office';
    if (selectedOffices.length === 1) {
      const office = offices.find(o => o.id === selectedOffices[0]);
      return office ? office.name : 'Select office';
    }
    return `${selectedOffices.length} offices selected`;
  };

  const getFilteredUacsItems = (searchTerm) => {
    if (!searchTerm) return uacsCategories;
    
    const search = searchTerm.toLowerCase();
    return uacsCategories
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.name.toLowerCase().includes(search) ||
          item.code.toLowerCase().includes(search)
        )
      }))
      .filter(category => category.items.length > 0);
  };

  const calculateItemTotal = (item) => {
    const qty = parseFloat(item.quantity) || 0;
    const cost = parseFloat(item.unitCost) || 0;
    return qty * cost;
  };

  const calculateOfficeTotal = (officeId) => {
    if (!officeItems[officeId]) return 0;
    return officeItems[officeId].reduce((sum, item) => sum + calculateItemTotal(item), 0);
  };

  const calculateGrandTotal = () => {
    return Object.keys(officeItems).reduce((sum, officeId) => sum + calculateOfficeTotal(officeId), 0);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo">GSS</div>
            <div className="logo-text">
              <h1>DENR GSS</h1>
              <p>Tracking System</p>
            </div>
          </div>
        </div>

        <nav className="nav-menu">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span className="nav-text">Dashboard</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <span className="nav-text">Inventory</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Forms & Reports</div>
            <div className="nav-item active">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="nav-text">IAR</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
              <span className="nav-text">RIS</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="nav-text">RSMI</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="nav-text">ICS</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <span className="nav-text">RSEPI</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="nav-text">PAR</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Analytics</div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span className="nav-text">Reports Dashboard</span>
            </div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="nav-text">Export Data</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <div className="nav-item">
              <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span className="nav-text">Configuration</span>
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">EB</div>
            <div className="user-info">
              <h4>EJ Boteros</h4>
              <p>CDD Officer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <div className="breadcrumb">
            <span>Forms</span>
            <span>›</span>
            <span>IAR</span>
            <span>›</span>
            <span>New Entry</span>
          </div>
          <h1 className="page-title">Inspection and Acceptance Report</h1>
          <p className="page-subtitle">Complete the form below to create a new IAR entry for procurement tracking</p>
        </div>

        <form className="form-container" onSubmit={handleFormSubmit}>
          <div className="form-header">
            <h2>IAR Form - DENR Region 6, Iloilo City</h2>
            <p>Fill in all required fields to generate an inspection and acceptance report</p>
          </div>

          <div className="form-body">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="section-title">Basic Information</h3>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>IAR Number <span className="required">*</span></label>
                  <input id="iarNumber" name="iarNumber" type="text" placeholder="Enter IAR number" required />
                </div>
                <div className="form-group">
                  <label>IAR Date <span className="required">*</span></label>
                  <input id="iarDate" name="iarDate" type="date" required />
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="form-section">
              <h3 className="section-title">Supplier Information</h3>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>Supplier <span className="required">*</span></label>
                  <select 
                    required 
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                  >
                    <option value="">-- Select Supplier --</option>
                    <option value="RASA SURVEYING INSTRUMENTS">RASA Surveying Instruments</option>
                    <option value="ABC Equipment Corp">ABC Equipment Corp.</option>
                    <option value="XYZ Office Supplies">XYZ Office Supplies</option>
                    <option value="DEF Technology Solutions">DEF Technology Solutions</option>
                    <option value="others">Others (Please Specify)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Supporting Documents <span className="required">*</span></label>
                  <select id="supportingDocs" required>
                    <option value="">-- Select Document --</option>
                    <option value="None">None</option>
                    <option value="Warranty Certificate">Warranty Certificate</option>
                    <option value="Surety Bond">Surety Bond</option>
                  </select>
                </div>
                {supplier === 'others' && (
                  <div className="form-group full-width">
                    <label>Specify Supplier Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      placeholder="Enter supplier name"
                      value={otherSupplier}
                      onChange={(e) => setOtherSupplier(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Billing Invoice Number <span className="required">*</span></label>
                  <input id="billingInvoice" type="text" placeholder="Enter billing invoice number" required />
                </div>
                <div className="form-group">
                  <label>Invoice Date <span className="required">*</span></label>
                  <input id="invoiceDate"type="date" required />
                </div>
                <div className="form-group">
                  <label>Delivery Receipt Number <span className="required">*</span></label>
                  <input type="text" id="deliveryReceipt" placeholder="Enter delivery receipt number" required />
                </div>
                <div className="form-group">
                  <label>Delivery Date <span className="required">*</span></label>
                  <input id="deliveryDate" type="date" required />
                </div>
              </div>
            </div>

            {/* Purchase Order Details */}
            <div className="form-section">
              <h3 className="section-title">Purchase Order Details</h3>
              <div className="form-grid two-col">
                <div className="form-group">
                  <label>P.O. Number <span className="required">*</span></label>
                  <input id="poNumber" name="poNumber" type="text" placeholder="Enter P.O. number" required />
                </div>
                <div className="form-group">
                  <label>P.O. Date <span className="required">*</span></label>
                  <input id="poDate" name="poDate" type="date" required />
                </div>
                <div className="form-group">
                  <label>Obligation Number <span className="required">*</span></label>
                  <input id="obligationNumber" type="text" placeholder="Enter obligation number" required />
                </div>
                <div className="form-group">
                  <label>Obligation Date <span className="required">*</span></label>
                  <input id="obligationDate" type="date" required />
                </div>
                <div className="form-group full-width">
                  <label>Requisitioning Offices/Departments <span className="required">*</span></label>

                  <div 
                    className={`office-dropdown ${officeDropdownOpen ? 'open' : ''}`}
                    ref={officeDropdownRef}
                  >
                    <button
                      type="button"
                      className="office-dropdown-trigger"
                      onClick={() => setOfficeDropdownOpen(!officeDropdownOpen)}
                      aria-haspopup="listbox"
                      aria-expanded={officeDropdownOpen}
                    >
                      <span className="office-dropdown-text">{getSelectedOfficesText()}</span>
                      <span className="office-dropdown-caret">▾</span>
                    </button>

                    <div
                      className="office-dropdown-panel"
                      role="listbox"
                      aria-multiselectable="true"
                    >
                      <div className="office-checkbox-container--dropdown">
                        {filteredOffices.map((office) => {
                          const isParent = hasChildren(office.id);
                          
                          if (isParent) {
                            // Render parent office as section header only
                            return (
                              <div 
                                key={office.id}
                                className="office-checkbox-group"
                              >
                                <label style={{ fontWeight: '600', marginLeft: '0' }}>
                                  {office.name}
                                </label>
                              </div>
                            );
                          }
                          
                          // Render leaf offices with checkboxes
                          return (
                            <div 
                              key={office.id}
                              className={`office-checkbox-group ${office.parent ? 'office-sub-item' : ''}`}
                            >
                              <input 
                                type="checkbox" 
                                id={`office-${office.id}`}
                                checked={selectedOffices.includes(office.id)}
                                onChange={() => handleOfficeToggle(office.id)}
                              />
                              <label htmlFor={`office-${office.id}`}>
                                {office.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>

                      <div className="office-dropdown-footer">
                        <button type="button" className="office-mini-btn" onClick={handleSelectAll}>
                          Select all
                        </button>
                        <button type="button" className="office-mini-btn" onClick={handleClearAll}>
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Office-Based Items Container */}
            <div id="officeItemsContainer" className="office-items-container">
              {selectedOffices.length === 0 ? (
                <div className="empty-summary" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                  <p>Select offices above to add items for each office</p>
                </div>
              ) : (
                selectedOffices.map(officeId => {
                  const office = offices.find(o => o.id === officeId);
                  if (!office) return null;

                  return (
                    <div key={officeId} className="office-section">
                      <div className="office-section-header">
                        <span className="office-badge">{office.id}</span>
                        <span>{office.name}</span>
                      </div>

                      {/* Items for this office */}
                      {officeItems[officeId]?.map((item, index) => (
                        <div key={item.id} className="item-card">
                          <div className="item-header">
                            <span className="item-number">ITEM {index + 1}</span>
                            <button
                              type="button"
                              className="remove-item-btn"
                              onClick={() => handleRemoveItem(officeId, item.id)}
                            >
                              Remove Item
                            </button>
                          </div>

                          <div className="form-grid two-col">
                            {/* Row 1: Category and UACS Code */}
                            {/* Category Dropdown */}
                            <div className="form-group">
                              <label>Category <span className="required">*</span></label>
                              <div 
                                className={`uacs-dropdown ${uacsDropdownOpen[`${officeId}-${item.id}-category`] ? 'open' : ''}`}
                                ref={el => uacsDropdownRefs.current[`${officeId}-${item.id}-category`] = el}
                              >
                                <button
                                  type="button"
                                  className="uacs-dropdown-trigger"
                                  onClick={() => setUacsDropdownOpen({
                                    ...uacsDropdownOpen,
                                    [`${officeId}-${item.id}-category`]: !uacsDropdownOpen[`${officeId}-${item.id}-category`]
                                  })}
                                >
                                  <span className={`uacs-dropdown-text ${item.category ? 'has-value' : ''}`}>
                                    {item.category || 'Select Category'}
                                  </span>
                                  <span className="uacs-dropdown-caret">▾</span>
                                </button>

                                <div className="uacs-dropdown-panel">
                                  <div className="uacs-dropdown-search">
                                    <input
                                      type="text"
                                      placeholder="Search category..."
                                      value={uacsSearchTerms[`${officeId}-${item.id}-category`] || ''}
                                      onChange={(e) => setUacsSearchTerms({
                                        ...uacsSearchTerms,
                                        [`${officeId}-${item.id}-category`]: e.target.value
                                      })}
                                    />
                                  </div>

                                  <div className="uacs-dropdown-list">
                                    {getFilteredUacsItems(uacsSearchTerms[`${officeId}-${item.id}-category`] || '').length === 0 ? (
                                      <div className="uacs-dropdown-empty">No categories found</div>
                                    ) : (
                                      getFilteredUacsItems(uacsSearchTerms[`${officeId}-${item.id}-category`] || '').map(category => (
                                        <div key={category.category} className="category-group">
                                          <div className="category-main">{category.category}</div>
                                          {category.items.map(uacs => (
                                            <div
                                              key={uacs.code}
                                              className="category-sub"
                                              onClick={() => handleCategorySelect(officeId, item.id, uacs)}
                                            >
                                              <span className="category-sub-name">{uacs.name}</span>
                                              <span className="category-sub-code">{uacs.code}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* UACS Code Dropdown */}
                            <div className="form-group">
                              <label>UACS Code <span className="required">*</span></label>
                              <div 
                                className={`uacs-dropdown ${uacsDropdownOpen[`${officeId}-${item.id}`] ? 'open' : ''}`}
                                ref={el => uacsDropdownRefs.current[`${officeId}-${item.id}`] = el}
                              >
                                <button
                                  type="button"
                                  className="uacs-dropdown-trigger"
                                  onClick={() => setUacsDropdownOpen({
                                    ...uacsDropdownOpen,
                                    [`${officeId}-${item.id}`]: !uacsDropdownOpen[`${officeId}-${item.id}`]
                                  })}
                                >
                                  <span className={`uacs-dropdown-text ${item.uacsCode ? 'has-value' : ''}`}>
                                    {item.uacsCode || 'Select UACS Code'}
                                  </span>
                                  <span className="uacs-dropdown-caret">▾</span>
                                </button>

                                <div className="uacs-dropdown-panel">
                                  <div className="uacs-dropdown-search">
                                    <input
                                      type="text"
                                      placeholder="Search UACS code..."
                                      value={uacsSearchTerms[`${officeId}-${item.id}`] || ''}
                                      onChange={(e) => setUacsSearchTerms({
                                        ...uacsSearchTerms,
                                        [`${officeId}-${item.id}`]: e.target.value
                                      })}
                                    />
                                  </div>

                                  <div className="uacs-dropdown-list">
                                    {getFilteredUacsItems(uacsSearchTerms[`${officeId}-${item.id}`] || '').length === 0 ? (
                                      <div className="uacs-dropdown-empty">No UACS codes found</div>
                                    ) : (
                                      getFilteredUacsItems(uacsSearchTerms[`${officeId}-${item.id}`] || '').map(category => (
                                        <div key={category.category} className="category-group">
                                          <div className="category-main">{category.category}</div>
                                          {category.items.map(uacs => (
                                            <div
                                              key={uacs.code}
                                              className="category-sub"
                                              onClick={() => handleUacsSelect(officeId, item.id, uacs)}
                                            >
                                              <span className="category-sub-code" style={{ marginRight: '0.5rem', marginLeft: 0 }}>{uacs.code}</span>
                                              <span className="category-sub-name" style={{ fontSize: '0.75rem', color: '#64748b' }}>{uacs.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Row 2: Item Name and Description */}
                            {/* Item Name Dropdown */}
                            <div className="form-group">
                              <label>Item <span className="required">*</span></label>
                              <select
                                value={item.itemName}
                                onChange={(e) => handleItemChange(officeId, item.id, 'itemName', e.target.value)}
                                required
                              >
                                <option value="">-- Select Item --</option>
                                {itemNames.map((name, idx) => (
                                  <option key={idx} value={name}>{name}</option>
                                ))}
                              </select>
                            </div>

                            {/* Item Description Dropdown */}
                            <div className="form-group">
                              <label>Description <span className="required">*</span></label>
                              <select
                                value={item.description}
                                onChange={(e) => handleItemChange(officeId, item.id, 'description', e.target.value)}
                                required
                                disabled={!item.itemName}
                              >
                                <option value="">-- Select Description --</option>
                                {item.itemName && itemsWithDescriptions[item.itemName]?.map((desc, idx) => (
                                  <option key={idx} value={desc}>{desc}</option>
                                ))}
                              </select>
                              {!item.itemName && (
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                  Please select an item first
                                </p>
                              )}
                            </div>

                            {/* Custom Item Name (if Others selected) */}
                            {item.itemName === 'Others (Please Specify)' && (
                              <div className="form-group">
                                <label>Specify Item Name <span className="required">*</span></label>
                                <input
                                  type="text"
                                  placeholder="Enter specific item name"
                                  value={item.customItemName}
                                  onChange={(e) => handleItemChange(officeId, item.id, 'customItemName', e.target.value)}
                                  required
                                />
                              </div>
                            )}

                            {/* Custom Description (if Others selected) */}
                            {item.description === 'Others (Please Specify)' && (
                              <div className="form-group">
                                <label>Specify Description <span className="required">*</span></label>
                                <input
                                  type="text"
                                  placeholder="Enter detailed description"
                                  value={item.customDescription}
                                  onChange={(e) => handleItemChange(officeId, item.id, 'customDescription', e.target.value)}
                                  required
                                />
                              </div>
                            )}

                            {/* Row 3: Unit Cost and Quantity */}
                            {/* Unit Cost */}
                            <div className="form-group">
                              <label>Unit Cost (₱) <span className="required">*</span></label>
                              <input
                                type="number"
                                placeholder="0.00"
                                value={item.unitCost}
                                onChange={(e) => handleItemChange(officeId, item.id, 'unitCost', e.target.value)}
                                required
                                min="0"
                                step="0.01"
                              />
                            </div>

                            {/* Quantity */}
                            <div className="form-group">
                              <label>Quantity <span className="required">*</span></label>
                              <input
                                type="number"
                                placeholder="0"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(officeId, item.id, 'quantity', e.target.value)}
                                required
                                min="0"
                                step="1"
                              />
                            </div>

                            {/* Row 4: Unit and Total Amount */}
                            {/* Unit */}
                            <div className="form-group">
                              <label>Unit <span className="required">*</span></label>
                              <select
                                value={item.unit}
                                onChange={(e) => handleItemChange(officeId, item.id, 'unit', e.target.value)}
                                required
                              >
                                <option value="">-- Select Unit --</option>
                                <option value="piece">Piece</option>
                                <option value="unit">Unit</option>
                                <option value="set">Set</option>
                                <option value="box">Box</option>
                                <option value="ream">Ream</option>
                                <option value="pack">Pack</option>
                              </select>
                            </div>

                            {/* Total Amount */}
                            <div className="form-group">
                              <label>Total Amount (₱)</label>
                              <input
                                type="text"
                                value={`₱${calculateItemTotal(item).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                readOnly
                                style={{ background: '#f1f5f9', fontWeight: '600' }}
                              />
                            </div>

                            {/* Classification (Auto-calculated) */}
                            <div className="form-group full-width">
                              <label>Classification (Auto-calculated based on Unit Cost)</label>
                              {(() => {
                                const classification = getClassification(parseFloat(item.unitCost) || 0);
                                return (
                                  <div style={{ marginTop: '0.5rem' }}>
                                    <span className={`classification-badge ${
                                      classification === 'Stock' ? 'classification-stock' :
                                      classification === 'ICS' ? 'classification-ics' :
                                      'classification-property'
                                    }`}>
                                      {getClassificationLabel(classification)}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Tracking Numbers Section */}
                            {(() => {
                              const classification = getClassification(parseFloat(item.unitCost) || 0);
                              const qty = parseInt(item.quantity) || 0;

                              if (classification === 'Stock') {
                                // Stock Card: Single inputs
                                return (
                                  <div className="form-group full-width" style={{ 
                                    background: '#f0f9ff', 
                                    padding: '1rem', 
                                    borderRadius: '6px',
                                    border: '1px solid #bae6fd'
                                  }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                                      Stock Card Tracking
                                    </h4>
                                    <div className="form-grid two-col">
                                      <div className="form-group">
                                        <label>Stock Number</label>
                                        <input
                                          type="text"
                                          placeholder="Enter stock number"
                                          value={item.stockNumber}
                                          onChange={(e) => handleItemChange(officeId, item.id, 'stockNumber', e.target.value)}
                                        />
                                      </div>
                                      <div className="form-group">
                                        <label>Serial Number</label>
                                        <input
                                          type="text"
                                          placeholder="Enter serial number"
                                          value={item.stockSerialNumber}
                                          onChange={(e) => handleItemChange(officeId, item.id, 'stockSerialNumber', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else if (classification === 'ICS' && qty > 0) {
                                // ICS: Multiple inputs (one per quantity)
                                return (
                                  <div className="form-group full-width" style={{ 
                                    background: '#fefce8', 
                                    padding: '1rem', 
                                    borderRadius: '6px',
                                    border: '1px solid #fde68a'
                                  }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                                      ICS Tracking Numbers (One per unit - {qty} total)
                                    </h4>
                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                      {Array.from({ length: qty }, (_, index) => (
                                        <div key={index} style={{ 
                                          background: 'white', 
                                          padding: '0.75rem', 
                                          borderRadius: '4px',
                                          border: '1px solid #fde68a'
                                        }}>
                                          <div style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600', 
                                            marginBottom: '0.5rem',
                                            color: '#92400e'
                                          }}>
                                            Unit {index + 1}
                                          </div>
                                          <div className="form-grid two-col">
                                            <div className="form-group">
                                              <label>ICS Number</label>
                                              <input
                                                type="text"
                                                placeholder={`ICS # for unit ${index + 1}`}
                                                value={item.icsNumbers[index] || ''}
                                                onChange={(e) => handleTrackingNumberChange(officeId, item.id, 'icsNumber', index, e.target.value)}
                                              />
                                            </div>
                                            <div className="form-group">
                                              <label>Serial Number</label>
                                              <input
                                                type="text"
                                                placeholder={`Serial # for unit ${index + 1}`}
                                                value={item.icsSerialNumbers[index] || ''}
                                                onChange={(e) => handleTrackingNumberChange(officeId, item.id, 'icsSerial', index, e.target.value)}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              } else if (classification === 'Property' && qty > 0) {
                                // Property: Multiple inputs (one per quantity)
                                return (
                                  <div className="form-group full-width" style={{ 
                                    background: '#f0fdf4', 
                                    padding: '1rem', 
                                    borderRadius: '6px',
                                    border: '1px solid #a7f3d0'
                                  }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>
                                      Property Card Tracking Numbers (One per unit - {qty} total)
                                    </h4>
                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                      {Array.from({ length: qty }, (_, index) => (
                                        <div key={index} style={{ 
                                          background: 'white', 
                                          padding: '0.75rem', 
                                          borderRadius: '4px',
                                          border: '1px solid #a7f3d0'
                                        }}>
                                          <div style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: '600', 
                                            marginBottom: '0.5rem',
                                            color: '#065f46'
                                          }}>
                                            Unit {index + 1}
                                          </div>
                                          <div className="form-grid two-col">
                                            <div className="form-group">
                                              <label>Property Number</label>
                                              <input
                                                type="text"
                                                placeholder={`Property # for unit ${index + 1}`}
                                                value={item.propertyNumbers[index] || ''}
                                                onChange={(e) => handleTrackingNumberChange(officeId, item.id, 'propertyNumber', index, e.target.value)}
                                              />
                                            </div>
                                            <div className="form-group">
                                              <label>Serial Number</label>
                                              <input
                                                type="text"
                                                placeholder={`Serial # for unit ${index + 1}`}
                                                value={item.propertySerialNumbers[index] || ''}
                                                onChange={(e) => handleTrackingNumberChange(officeId, item.id, 'propertySerial', index, e.target.value)}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }
                              
                              return null;
                            })()}
                          </div>
                        </div>
                      ))}

                      {/* Add Item Button */}
                      <button
                        type="button"
                        className="add-item-btn"
                        onClick={() => handleAddItem(officeId)}
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Item for {office.name}
                      </button>

                      {/* Office Total */}
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '1rem', 
                        background: '#f0fdf4', 
                        borderRadius: '6px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontWeight: '600'
                      }}>
                        <span>Subtotal for {office.name}:</span>
                        <span style={{ fontSize: '1.125rem', color: '#10b981' }}>
                          ₱{calculateOfficeTotal(officeId).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Summary */}
              {selectedOffices.length > 0 && (
                <div className="summary-section show">
                  <h3>Summary</h3>
                  <table className="summary-table">
                    <thead>
                      <tr>
                        <th>Office</th>
                        <th>Description</th>
                        <th style={{ textAlign: 'right' }}>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOffices.map(officeId => {
                        const office = offices.find(o => o.id === officeId);
                        return (officeItems[officeId] || []).map((item, index) => (
                          <tr key={`${officeId}-${item.id}`}>
                            <td>
                              {office.name}
                            </td>
                            <td>
                              <div style={{ fontSize: '0.875rem' }}>
                                <div style={{ fontWeight: '600' }}>{item.itemName}</div>
                                <div style={{ color: '#64748b', fontSize: '0.8125rem' }}>{item.description}</div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: '600' }}>
                              {item.quantity}
                            </td>
                          </tr>
                        ));
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="2" style={{ textAlign: 'right' }}>Total Quantity:</td>
                        <td style={{ textAlign: 'right', fontSize: '1.125rem', fontWeight: '600' }}>
                          {(() => {
                            let totalQty = 0;
                            selectedOffices.forEach(officeId => {
                              (officeItems[officeId] || []).forEach(item => {
                                totalQty += parseInt(item.quantity) || 0;
                              });
                            });
                            return totalQty;
                          })()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Acceptance Section */}
            <div className="form-section">
              <h3 className="section-title">Inspection & Acceptance</h3>
              
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="complete"
                    checked={isComplete}
                    onChange={handleCompleteChange}
                  />
                  <label htmlFor="complete">Complete - Inspected, verified and found in order as to quantity and specifications</label>
                </div>
                <div className="checkbox-item">
                  <input 
                    type="checkbox" 
                    id="partial"
                    checked={isPartial}
                    onChange={handlePartialChange}
                  />
                  <label htmlFor="partial">Partial (Please specify quantity below)</label>
                </div>
                {isPartial && (
                  <div className="form-group partial-input">
                    <label>Specify Partial Quantity</label>
                    <textarea id="partialDetails" name="partialDetails" placeholder="Enter partial quantity details"></textarea>
                  </div>
                )}
              </div>

              <div className="signature-grid">
                <div className="signature-box">
                  <h4>Property Inspector</h4>
                  <div className="form-group">
                    <label>Name <span className="required">*</span></label>
                    <input id="inspectorName" type="text" placeholder="Enter inspector name" required />
                  </div>
                  <div className="form-group">
                    <label>Date Inspected <span className="required">*</span></label>
                    <input id="dateInspected" type="date" required />
                  </div>
                </div>
                <div className="signature-box">
                  <h4>Property Custodian</h4>
                  <div className="form-group">
                    <label>Name <span className="required">*</span></label>
                    <input id="custodianName" type="text" defaultValue="APRIL JOY A. CELESTIAL" required />
                  </div>
                  <div className="form-group">
                    <label>Date Received <span className="required">*</span></label>
                    <input id="dateReceived" type="date" required />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => navigate("/iar-landing-page")}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Submit IAR</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
