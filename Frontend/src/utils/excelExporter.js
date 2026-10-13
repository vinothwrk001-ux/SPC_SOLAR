import ExcelJS from 'exceljs';

/**
 * Generates and downloads a beautifully styled, corporate Excel sheet for Customer Leads.
 * Includes executive KPI banners, customized status badges, zebra rows, freeze panes, auto-filter,
 * and dynamic column width auto-adjustment.
 *
 * @param {Array} leads - The list of lead objects to export
 * @param {string} filterName - Current filter label (e.g., 'All', 'NEW', etc.)
 */
export const exportLeadsToExcel = async (leads = [], filterName = 'All') => {
  if (!leads || leads.length === 0) {
    throw new Error('No leads available to export.');
  }

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SPC Solar CRM System';
  workbook.lastModifiedBy = 'SPC Solar Admin';
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet('Customer Leads', {
    views: [{ state: 'frozen', ySplit: 7 }], // Freeze top 7 rows (Title + KPIs + Table Header)
    pageSetup: { orientation: 'landscape', paperSize: 9 }
  });

  // Enable grid lines
  worksheet.views[0].showGridLines = true;

  // -------------------------------------------------------------
  // 1. REPORT TITLE BANNER (Row 1 & 2)
  // -------------------------------------------------------------
  worksheet.mergeCells('A1:K1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = 'SPC SOLAR — CUSTOMER LEADS & CRM PIPELINE REPORT';
  titleCell.font = {
    name: 'Segoe UI',
    size: 15,
    bold: true,
    color: { argb: 'FFFFFFFF' }
  };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFB91C1C' } // SPC Solar Red #B91C1C
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(1).height = 36;

  worksheet.mergeCells('A2:K2');
  const subTitleCell = worksheet.getCell('A2');
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) + ' at ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  subTitleCell.value = `Exported on: ${dateStr}  |  Filtered Stage: ${filterName.toUpperCase()}  |  Total Exported Records: ${leads.length}  |  CONFIDENTIAL`;
  subTitleCell.font = {
    name: 'Segoe UI',
    size: 9.5,
    italic: true,
    color: { argb: 'FFE2E8F0' }
  };
  subTitleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F172A' } // Dark Slate #0F172A
  };
  subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.getRow(2).height = 22;

  // Row 3: Blank spacing row
  worksheet.getRow(3).height = 10;

  // -------------------------------------------------------------
  // 2. EXECUTIVE KPI CARDS BLOCK (Row 4 & 5)
  // -------------------------------------------------------------
  const totalCount = leads.length;
  const newCount = leads.filter(l => (l.status || '').toUpperCase() === 'NEW').length;
  const inDiscussionCount = leads.filter(l => {
    const s = (l.status || '').toUpperCase().replace(/[\s-]/g, '_');
    return s === 'IN_DISCUSSION' || s === 'CONTACTED';
  }).length;
  const convertedCount = leads.filter(l => (l.status || '').toUpperCase() === 'CONVERTED').length;

  // Helper to style KPI card
  const styleKpi = (startCol, endCol, label, val, bgArgb, textArgb) => {
    worksheet.mergeCells(`${startCol}4:${endCol}4`);
    worksheet.mergeCells(`${startCol}5:${endCol}5`);

    const labelCell = worksheet.getCell(`${startCol}4`);
    labelCell.value = label.toUpperCase();
    labelCell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: textArgb } };
    labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
    labelCell.alignment = { horizontal: 'center', vertical: 'middle' };

    const valCell = worksheet.getCell(`${startCol}5`);
    valCell.value = val;
    valCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: textArgb } };
    valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
    valCell.alignment = { horizontal: 'center', vertical: 'middle' };

    // Apply borders around KPI cell block
    const cols = [startCol, endCol];
    cols.forEach(c => {
      [4, 5].forEach(r => {
        worksheet.getCell(`${c}${r}`).border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });
  };

  styleKpi('A', 'B', 'Total Inquiries', totalCount, 'FFF1F5F9', 'FF1E293B');
  styleKpi('C', 'E', 'New Leads in Queue', newCount, 'FFEFF6FF', 'FF1D4ED8');
  styleKpi('F', 'H', 'In Discussion / Contacted', inDiscussionCount, 'FFFEF3C7', 'FFB45309');
  styleKpi('I', 'K', 'Converted Customer Orders', convertedCount, 'FFDCFCE7', 'FF15803D');

  worksheet.getRow(4).height = 18;
  worksheet.getRow(5).height = 24;

  // Row 6: Spacing row
  worksheet.getRow(6).height = 10;

  // -------------------------------------------------------------
  // 3. TABLE HEADERS (Row 7)
  // -------------------------------------------------------------
  const headers = [
    { key: 'sno', header: 'S.No', width: 8 },
    { key: 'name', header: 'Customer Name', width: 22 },
    { key: 'phone', header: 'Phone Number', width: 16 },
    { key: 'email', header: 'Email Address', width: 24 },
    { key: 'city', header: 'City / Location', width: 18 },
    { key: 'systemSize', header: 'System Capacity', width: 18 },
    { key: 'monthlyBill', header: 'Monthly Bill', width: 16 },
    { key: 'status', header: 'Pipeline Status', width: 16 },
    { key: 'notes', header: 'Follow-up Notes / Requirement', width: 35 },
    { key: 'createdAt', header: 'Inquiry Date', width: 16 },
    { key: 'source', header: 'Lead Source', width: 22 }
  ];

  const headerRow = worksheet.getRow(7);
  headers.forEach((h, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = h.header;
    cell.font = {
      name: 'Segoe UI',
      size: 10.5,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' } // Slate Header #1E293B
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: idx === 0 || idx === 7 ? 'center' : 'left',
      wrapText: false
    };
    cell.border = {
      top: { style: 'medium', color: { argb: 'FF0F172A' } },
      left: { style: 'thin', color: { argb: 'FF334155' } },
      bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
      right: { style: 'thin', color: { argb: 'FF334155' } }
    };
  });
  headerRow.height = 28;

  // Enable AutoFilter on row 7
  worksheet.autoFilter = {
    from: { row: 7, column: 1 },
    to: { row: 7, column: headers.length }
  };

  // -------------------------------------------------------------
  // 4. DATA ROWS (Row 8 onwards)
  // -------------------------------------------------------------
  leads.forEach((lead, index) => {
    const rowNumber = index + 8;
    const row = worksheet.getRow(rowNumber);

    const formattedDate = lead.createdAt
      ? new Date(lead.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      : 'Recent';

    const rawStatus = (lead.status || 'New').trim();
    const normalizedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

    const rowData = [
      index + 1,
      lead.name || 'Anonymous Inquiry',
      lead.phone || '—',
      lead.email || '—',
      lead.city || lead.state || 'India',
      lead.systemSize || 'Rooftop Solar',
      lead.monthlyBill ? `₹${Number(lead.monthlyBill).toLocaleString('en-IN')}` : '—',
      normalizedStatus,
      lead.notes || '—',
      formattedDate,
      lead.source || 'Website Lead'
    ];

    row.values = rowData;
    row.height = 24;

    const isEven = index % 2 === 0;
    const bgRowColor = isEven ? 'FFFFFFFF' : 'FFF8FAFC'; // Soft zebra striping

    rowData.forEach((val, colIdx) => {
      const cell = row.getCell(colIdx + 1);

      cell.font = {
        name: 'Segoe UI',
        size: 9.5,
        color: { argb: 'FF334155' }
      };

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgRowColor }
      };

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      // Alignment defaults
      if (colIdx === 0) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      } else if (colIdx === 2 || colIdx === 6 || colIdx === 9) {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      } else {
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
      }

      // Customer name bold highlight
      if (colIdx === 1) {
        cell.font = { name: 'Segoe UI', size: 9.5, bold: true, color: { argb: 'FF0F172A' } };
      }

      // Status Badge Cell Custom Styling
      if (colIdx === 7) {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        const s = (val || '').toUpperCase().replace(/[\s-]/g, '_');

        if (s === 'CONVERTED') {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF15803D' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
        } else if (s === 'IN_DISCUSSION' || s === 'CONTACTED') {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FFB45309' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
        } else if (s === 'NEW') {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF1D4ED8' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEFF6FF' } };
        } else if (s === 'LOST' || s === 'CLOSED') {
          cell.font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF64748B' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
        }
      }
    });
  });

  // -------------------------------------------------------------
  // 5. DYNAMIC AUTO-ADJUSTMENT OF COLUMN WIDTHS
  // -------------------------------------------------------------
  worksheet.columns.forEach((column, colIdx) => {
    let maxLength = headers[colIdx] ? headers[colIdx].header.length : 10;

    column.eachCell({ includeEmpty: false }, (cell) => {
      // Ignore title and KPI summary rows (rows 1 to 6) in column width calculations
      if (cell.row >= 7) {
        const valStr = cell.value ? cell.value.toString() : '';
        if (valStr.length > maxLength) {
          maxLength = valStr.length;
        }
      }
    });

    // Add comfortable padding of +4 characters, with bounds between min 11 and max 52
    column.width = Math.min(Math.max(maxLength + 4, 11), 52);
  });

  // -------------------------------------------------------------
  // 6. GENERATE BUFFER & TRIGGER INSTANT BROWSER DOWNLOAD
  // -------------------------------------------------------------
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fileDate = now.toISOString().slice(0, 10);
  a.href = url;
  a.download = `SPC_Solar_Customer_Leads_${fileDate}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
