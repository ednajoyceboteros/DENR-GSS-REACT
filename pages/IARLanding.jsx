import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import html2pdf from 'html2pdf.js';

export default function IarLanding() {
  // Sample data - matches the original HTML data structure
  const [allData] = useState([
    { iarNo: '25-03-040', date: '2025-03-07', dateDisplay: 'March 7, 2025', supplier: 'RASA Surveying Instruments', prNumber: '24-101-12-283', department: 'CDD' },
    { iarNo: '25-03-039', date: '2025-03-05', dateDisplay: 'March 5, 2025', supplier: 'ABC Equipment Corp.', prNumber: '24-101-12-275', department: 'Admin' },
    { iarNo: '25-03-038', date: '2025-03-03', dateDisplay: 'March 3, 2025', supplier: 'XYZ Office Supplies', prNumber: '24-101-12-268', department: 'Finance' },
    { iarNo: '25-03-037', date: '2025-03-01', dateDisplay: 'March 1, 2025', supplier: 'Tech Solutions Inc.', prNumber: '24-101-12-260', department: 'CDD' },
    { iarNo: '25-02-036', date: '2025-02-28', dateDisplay: 'February 28, 2025', supplier: 'Green Earth Supplies', prNumber: '24-101-12-252', department: 'Admin' },
    { iarNo: '25-02-035', date: '2025-02-26', dateDisplay: 'February 26, 2025', supplier: 'Professional Equipment Ltd.', prNumber: '24-101-12-245', department: 'Finance' },
    { iarNo: '25-02-034', date: '2025-02-24', dateDisplay: 'February 24, 2025', supplier: 'Delta Office Mart', prNumber: '24-101-12-238', department: 'CDD' },
    { iarNo: '25-02-033', date: '2025-02-22', dateDisplay: 'February 22, 2025', supplier: 'Mega Corp Supplies', prNumber: '24-101-12-231', department: 'Admin' },
    { iarNo: '25-02-032', date: '2025-02-20', dateDisplay: 'February 20, 2025', supplier: 'Premier Tools & Equipment', prNumber: '24-101-12-224', department: 'Finance' },
    { iarNo: '25-02-031', date: '2025-02-18', dateDisplay: 'February 18, 2025', supplier: 'Quality Instruments Co.', prNumber: '24-101-12-217', department: 'CDD' }
  ]);

  // State management
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Calculate filtered data using useMemo for performance
  const filteredData = useMemo(() => {
    return allData.filter(row => {
      // Search filter (case-insensitive)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        row.iarNo.toLowerCase().includes(searchLower) ||
        row.supplier.toLowerCase().includes(searchLower) ||
        row.prNumber.toLowerCase().includes(searchLower);

      // Date from filter
      const matchesDateFrom = !filterDateFrom || row.date >= filterDateFrom;

      // Date to filter
      const matchesDateTo = !filterDateTo || row.date <= filterDateTo;

      // Department filter
      const matchesDepartment = !filterDepartment || row.department === filterDepartment;

      return matchesSearch && matchesDateFrom && matchesDateTo && matchesDepartment;
    });
  }, [allData, searchTerm, filterDateFrom, filterDateTo, filterDepartment]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterDateFrom) count++;
    if (filterDateTo) count++;
    if (filterDepartment) count++;
    return count;
  }, [searchTerm, filterDateFrom, filterDateTo, filterDepartment]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allData.length;
    const cddCount = allData.filter(r => r.department === 'CDD').length;
    const adminCount = allData.filter(r => r.department === 'Admin').length;
    const financeCount = allData.filter(r => r.department === 'Finance').length;
    
    return { total, cddCount, adminCount, financeCount };
  }, [allData]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterDepartment('');
    setIsFilterModalOpen(false);
  };

  // Apply filters and close modal
  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  };

  // Export to Excel
  const handleExportToExcel = () => {
    const rows = [];
    
    // Add headers
    const headers = ['IAR No.', 'Date', 'Supplier', 'PO Number', 'Office'];
    rows.push(headers);
    
    // Add filtered data
    filteredData.forEach(row => {
      rows.push([
        row.iarNo,
        row.dateDisplay,
        row.supplier,
        row.prNumber,
        row.department
      ]);
    });
    
    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 },  // IAR No.
      { wch: 18 },  // Date
      { wch: 30 },  // Supplier
      { wch: 18 },  // PO Number
      { wch: 15 }   // Office
    ];
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'IAR Submissions');
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    XLSX.writeFile(workbook, `IAR_Recent_Submissions_${timestamp}.xlsx`);
    
    setIsExportMenuOpen(false);
  };

  // Export to PDF
  const handleExportToPDF = () => {
    // Create a wrapper div with styling
    const element = document.createElement('div');
    element.style.padding = '20px';
    element.style.backgroundColor = '#ffffff';
    
    // Add title
    const title = document.createElement('h2');
    title.textContent = 'Inspection and Acceptance Reports';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';
    title.style.fontFamily = 'Arial, sans-serif';
    element.appendChild(title);
    
    // Create table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.fontFamily = 'Arial, sans-serif';
    table.style.fontSize = '10px';

    // Add header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['IAR No.', 'Date', 'Supplier', 'PO Number', 'Office'].forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      th.style.backgroundColor = '#f1f5f9';
      th.style.border = '1px solid #000';
      th.style.padding = '8px';
      th.style.textAlign = 'left';
      th.style.fontWeight = 'bold';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Add body
    const tbody = document.createElement('tbody');
    filteredData.forEach((row, index) => {
      const tr = document.createElement('tr');
      if (index % 2 === 0) {
        tr.style.backgroundColor = '#f9fafb';
      }
      
      [row.iarNo, row.dateDisplay, row.supplier, row.prNumber, row.department].forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        td.style.border = '1px solid #000';
        td.style.padding = '8px';
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    element.appendChild(table);

    
    // PDF options
    const options = {
      margin: 10,
      filename: `IAR_Report_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(options).from(element).save();
    
    setIsExportMenuOpen(false);
  };

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isExportMenuOpen && !event.target.closest('.export-dropdown')) {
        setIsExportMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isExportMenuOpen]);

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
          <div className="header-top">
            <div>
              <h1 className="page-title">Inspection and Acceptance Reports</h1>
            </div>
            <button className="create-btn" onClick={() => navigate("/iar-form")}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
              Create New IAR
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total IARs</div>
              </div>
              <div className="stat-icon total">
                <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-card">
          <div className="table-header">
            <div className="table-header-left">
              <h2 className="table-title">Recent Submissions</h2>
              <p className="table-subtitle">
                Showing <span id="showingCount">{filteredData.length}</span> of <span id="totalTableCount">{allData.length}</span> records
              </p>
            </div>
            <div className="table-header-right">
              <div className="table-search">
                <div className="search-wrapper">
                  <svg className="search-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search IAR No., Supplier, or PO..." 
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="table-actions">
                <button 
                  className="table-action-btn" 
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                  </svg>
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="filter-badge">{activeFilterCount}</span>
                  )}
                </button>
                <div className="export-dropdown">
                  <button 
                    className="table-action-btn" 
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Export
                    <svg className="dropdown-arrow" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                  <div className={`export-menu ${isExportMenuOpen ? 'show' : ''}`}>
                    <button className="export-option" onClick={handleExportToExcel}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      Export to Excel
                    </button>
                    <button className="export-option" onClick={handleExportToPDF}>
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                      </svg>
                      Export to PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>IAR Number</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>PO Number</th>
                  <th>Office</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr key={index}>
                      <td><span className="iar-number">{row.iarNo}</span></td>
                      <td>{row.dateDisplay}</td>
                      <td>{row.supplier}</td>
                      <td>{row.prNumber}</td>
                      <td>{row.department}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn view" title="View">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                          </button>
                          <button className="action-btn edit" title="Edit">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button className="action-btn delete" title="Delete">
                            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">
                      <div className="no-results">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p>No results found. Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="modal-overlay show" onClick={(e) => {
          if (e.target.className === 'modal-overlay show') {
            setIsFilterModalOpen(false);
          }
        }}>
          <div className="filter-modal">
            <div className="filter-modal-header">
              <h3 className="filter-modal-title">Filter IAR Records</h3>
              <button className="close-modal" onClick={() => setIsFilterModalOpen(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="filter-modal-body">
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Date From</label>
                  <input 
                    type="date" 
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Date To</label>
                  <input 
                    type="date" 
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <label>Department</label>
                  <select 
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="">All Departments</option>
                    <option value="CDD">CDD</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="filter-btn clear" onClick={handleClearFilters}>Clear Filters</button>
              <button className="filter-btn apply" onClick={handleApplyFilters}>Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}