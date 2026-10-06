import React, { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Logo from '../../assets/Logo.png';
import { FiPrinter } from 'react-icons/fi';

const AdminQuotationMaker = () => {
  const [formData, setFormData] = useState({
    refNo: 'QSP9021',
    date: new Date().toLocaleDateString('en-GB').replace(/\//g, '.'),
    toName: 'CUSTOMER NAME',
    toAddressLine1: 'STREET ADDRESS',
    toAddressLine2: 'CITY, PINCODE',
    kwSize: 100,
    systemType: 'ON GRID',
    panelQty: 182,
    panelMake: 'EASTMAN/ADDO WAAREE/EMMVEE/LUMINOUS/KIRLOSHKAR',
    inverterCapacity: 100,
    inverterMake: 'POLYCAB EASTMAN/ADDO',
    pricePerKw: 48000,
    gstPercent: 5,
    subsidyAmount: 0,
    advPercent: 10,
    secPercent: 70,
    thirdPercent: 20,
    gpayNumber: '8489644044',
  });

  const ON_GRID_DATA = {
    1: { panelQty: 2, panelMake: 'EASTMAN/EMMVEE\nADDO/VIKRAM SOLAR\nKIRLOSKAR/LUMINOUS', inverterCapacity: 1, inverterMake: 'ADDO\nPOLYCAB/EASTMAN', pricePerKw: 102000, subsidy: 30000, gst: 0, adv: 100, sec: 0, third: 0 },
    2: { panelQty: 4, panelMake: 'EMMVEE/EASTMAN\nADDO/VIKRAM SOLAR\nKIRLOSKAR/LUMINOUS', inverterCapacity: 3, inverterMake: 'ADDO\nPOLYCAB/EASTMAN', pricePerKw: 90000, subsidy: 60000, gst: 0, adv: 80, sec: 20, third: 0 },
    3: { panelQty: 6, panelMake: 'ADDO/EMMVEE\nEASTMAN/VIKRAM SOLAR\nUTL/KIRLOSKAR\nLUMINOUS', inverterCapacity: 3, inverterMake: 'ADDO\nEASTMAN/POLYCAB', pricePerKw: 76000, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    4: { panelQty: 7, panelMake: 'EMMVEE/ADDO/EASTMAN/\nVIKRAM SOLAR\nKIRLOSKAR/LUMINOUS/UTL', inverterCapacity: 5, inverterMake: 'EASTMAN/ADDO', pricePerKw: 68750, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    5: { panelQty: 9, panelMake: 'ADDO/EASTMAN/\nKIRLOSKAR/PANASONIC/\nLUMINOUS/UTL', inverterCapacity: 5, inverterMake: 'EASTMAN/POLYCAB', pricePerKw: 66900, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    6: { panelQty: 11, panelMake: 'ADDO/EASTMAN/KIRLOSKAR/\nEMMVEE\nVIKRAM SOLAR/LUMINOUS/UTL', inverterCapacity: 7, inverterMake: 'EASTMAN/ADDO\nPOLYCAB', pricePerKw: 65916.67, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    7: { panelQty: 13, panelMake: 'EASTMAN/ADDO\nEMMVEE/WAAREE/\nLUMINOUS/KIRLOSKAR', inverterCapacity: 7, inverterMake: 'EASTMAN/ADDO', pricePerKw: 64857.14, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    8: { panelQty: 15, panelMake: 'EASTMAN/ADDO\nEMMVEE/LUMINOUS/\nKIRLOSHKAR/UTL', inverterCapacity: 8, inverterMake: 'EASTMAN/ADDO', pricePerKw: 64275, subsidy: 78000, gst: 0, adv: 20, sec: 70, third: 10 },
    9: { panelQty: 16, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 10, inverterMake: 'EASTMAN/ADDO', pricePerKw: 62544.44, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    10: { panelQty: 18, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 10, inverterMake: 'EASTMAN/ADDO', pricePerKw: 62000, subsidy: 78000, gst: 0, adv: 80, sec: 20, third: 0 },
    15: { panelQty: 27, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE\nLUMINOUS/\nKIRLOSHKAR', inverterCapacity: 15, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    20: { panelQty: 36, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 20, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    25: { panelQty: 46, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 25, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 55000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    30: { panelQty: 55, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 30, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 54000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    35: { panelQty: 64, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 40, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 53000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    40: { panelQty: 73, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 40, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 53000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    50: { panelQty: 91, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 50, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 53000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    60: { panelQty: 109, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 60, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    70: { panelQty: 127, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 70, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    80: { panelQty: 146, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 80, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    90: { panelQty: 164, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 90, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    100: { panelQty: 182, panelMake: 'EASTMAN/ADDO\nWAAREE/EMMVEE/LUMINOUS/\nKIRLOSHKAR', inverterCapacity: 100, inverterMake: 'POLYCAB\nEASTMAN/ADDO', pricePerKw: 48000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 }
  };

  const OFF_GRID_DATA = {
    1: { panelQty: 2, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 1, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 90000, subsidy: 0, gst: 5, adv: 100, sec: 0, third: 0 },
    2: { panelQty: 4, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 3, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    3: { panelQty: 5, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 3, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    4: { panelQty: 7, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 5, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    5: { panelQty: 9, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 5, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    6: { panelQty: 10, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 6, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    7: { panelQty: 12, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 7, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    8: { panelQty: 14, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 8, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    9: { panelQty: 16, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 9, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 },
    10: { panelQty: 17, panelMake: 'ADDO/EASTMAN\nEMMVEE/UTL\nVIKRAM SOLAR\nWAAREE\nKIRLOASKAR', inverterCapacity: 10, inverterMake: 'SPC SOLAR\nLITHIYAM\nBATTERY/\nNEXION ENERGY', pricePerKw: 80000, subsidy: 0, gst: 5, adv: 10, sec: 70, third: 20 }
  };

  useEffect(() => {
    let data = null;
    
    if (formData.systemType === 'ON GRID' && ON_GRID_DATA[formData.kwSize]) {
      data = ON_GRID_DATA[formData.kwSize];
    } else if (formData.systemType === 'OFF GRID' && OFF_GRID_DATA[formData.kwSize]) {
      data = OFF_GRID_DATA[formData.kwSize];
    }

    if (data) {
      setFormData(prev => ({
        ...prev,
        panelQty: data.panelQty,
        panelMake: data.panelMake,
        inverterCapacity: data.inverterCapacity,
        inverterMake: data.inverterMake,
        pricePerKw: data.pricePerKw,
        gstPercent: data.gst,
        subsidyAmount: data.subsidy,
        advPercent: data.adv,
        secPercent: data.sec,
        thirdPercent: data.third,
      }));
    }
  }, [formData.kwSize, formData.systemType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  const kw = Number(formData.kwSize) || 0;
  const price = Number(formData.pricePerKw) || 0;
  const total = Math.round(kw * price);
  const subsidy = Number(formData.subsidyAmount) || 0;
  const gst = Math.round(total * ((Number(formData.gstPercent) || 0) / 100));
  const grandTotal = total - subsidy + gst;

  const term1 = Math.round(grandTotal * (Number(formData.advPercent) || 0) / 100);
  const term2 = Math.round(grandTotal * (Number(formData.secPercent) || 0) / 100);
  const term3 = Math.round(grandTotal * (Number(formData.thirdPercent) || 0) / 100);
  
  const displayedPerKw = Math.round((total - subsidy) / kw) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-3xl font-heading">Pro Quotation Maker</h2>
        <Button variant="primary" onClick={handlePrint} className="flex items-center gap-2">
          <FiPrinter /> Print / Save as PDF
        </Button>
      </div>

      {/* Admin Form (Hidden on Print) */}
      <div className="bg-white p-6 rounded-card shadow-sm border border-gray-200 print:hidden mb-8 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <Input label="Reference No" name="refNo" value={formData.refNo} onChange={handleChange} />
        <Input label="Date" name="date" value={formData.date} onChange={handleChange} />
        <Input label="Customer Name" name="toName" value={formData.toName} onChange={handleChange} />
        <Input label="Address Line 1" name="toAddressLine1" value={formData.toAddressLine1} onChange={handleChange} />
        <Input label="Address Line 2" name="toAddressLine2" value={formData.toAddressLine2} onChange={handleChange} />
        <Input label="System KW Size" name="kwSize" type="number" value={formData.kwSize} onChange={handleChange} />
        <div className="flex flex-col w-full mb-4">
          <label className="mb-1.5 font-sans font-semibold text-xs uppercase tracking-wider text-gray-700">
            System Type
          </label>
          <select
            name="systemType"
            value={formData.systemType}
            onChange={handleChange}
            className="w-full px-4 py-3 text-sm font-sans outline-none transition-all duration-200 rounded-md bg-white text-black border border-gray-200 hover:border-gray-400 focus:border-black cursor-pointer appearance-none"
            style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
          >
            <option value="ON GRID">ON GRID</option>
            <option value="OFF GRID">OFF GRID</option>
            <option value="HYBRID">HYBRID</option>
          </select>
        </div>
        <Input label="Price Per KW (Rs)" name="pricePerKw" type="number" value={formData.pricePerKw} onChange={handleChange} />
        <Input label="Subsidy Amount" name="subsidyAmount" type="number" value={formData.subsidyAmount} onChange={handleChange} />
        <Input label="GST %" name="gstPercent" type="number" value={formData.gstPercent} onChange={handleChange} />
        <Input label="Panel Qty" name="panelQty" type="number" value={formData.panelQty} onChange={handleChange} />
        <Input label="Panel Make" name="panelMake" value={formData.panelMake} onChange={handleChange} />
        <Input label="Inverter Capacity (KVA)" name="inverterCapacity" type="number" value={formData.inverterCapacity} onChange={handleChange} />
        <Input label="Inverter Make" name="inverterMake" value={formData.inverterMake} onChange={handleChange} />
        <Input label="Advance Payment %" name="advPercent" type="number" value={formData.advPercent} onChange={handleChange} />
        <Input label="Second Payment %" name="secPercent" type="number" value={formData.secPercent} onChange={handleChange} />
        <Input label="Last Payment %" name="thirdPercent" type="number" value={formData.thirdPercent} onChange={handleChange} />
        <Input label="GPay Number" name="gpayNumber" value={formData.gpayNumber} onChange={handleChange} />
      </div>

      {/* --- PRINTABLE QUOTATION VIEW --- */}
      <div className="print:block bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#0f172a] text-gray-200 p-8 print:p-10 mx-auto w-full max-w-[210mm] print:max-w-full min-h-[297mm] print:min-h-screen shadow-2xl print:shadow-none font-sans text-[11px] leading-tight relative overflow-hidden print:overflow-visible">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none print:hidden"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none print:hidden"></div>

        {/* PAGE 1 */}
        <div className="page-break-after-always pb-10 print:pb-0 relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="font-medium text-[10px] uppercase leading-relaxed text-gray-300 tracking-wider">
              <p className="text-white font-bold text-sm mb-1">SPC SOLAR TECHNOLOGY</p>
              <p>No-115-117, Easwari Towers,</p>
              <p>Devanga High School Road, RS Puram,</p>
              <p>Coimbatore - 641002.</p>
              <p className="mt-1 text-red-300">MOBILE: 84896 44044, 80987 44044</p>
              <p className="text-red-300">spctechnologycoimbatore@gmail.com</p>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="bg-white/95 p-3 rounded-xl shadow-lg border border-white/10 backdrop-blur-sm">
                <img src={Logo} alt="SPC Solar Logo" className="w-36" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 drop-shadow-sm">
              {formData.systemType} QUOTATION
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-2"></div>
          </div>

          {/* Ref & Date & To */}
          <div className="flex justify-between mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="uppercase">
              <p className="text-red-400 text-xs font-bold mb-1 tracking-widest">BILL TO</p>
              <p className="font-bold text-white text-sm">{formData.toName}</p>
              <p className="text-gray-400">{formData.toAddressLine1}</p>
              <p className="text-gray-400">{formData.toAddressLine2}</p>
            </div>
            <div className="text-right uppercase">
               <p className="text-red-400 text-xs font-bold mb-1 tracking-widest">DETAILS</p>
              <p><span className="text-gray-400 mr-2">REF:</span> <span className="font-bold text-white">{formData.refNo}</span></p>
              <p><span className="text-gray-400 mr-2">DATE:</span> <span className="font-bold text-white">{formData.date}</span></p>
              <p className="mt-2 text-sm"><span className="text-gray-400 mr-2">SYSTEM:</span> <span className="font-bold text-red-400">{formData.kwSize} KW ({formData.systemType})</span></p>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden border border-white/20 bg-[#0f172a]/50 backdrop-blur-md shadow-xl mb-8">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-white/10 text-white font-bold tracking-wider text-xs uppercase">
                  <th className="p-3 border-b border-r border-white/10 w-8">#</th>
                  <th className="p-3 border-b border-r border-white/10 text-left">Capital Expenditure (per MWp)</th>
                  <th className="p-3 border-b border-r border-white/10">Qty</th>
                  <th className="p-3 border-b border-r border-white/10">Make</th>
                  <th className="p-3 border-b border-white/10 w-28">INR</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">1</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">PV Modules – {formData.systemType === 'OFF GRID' ? '580' : '550'} Watts-Mono Perc Ofcut Bifacial - MNRE Approved - 25 Years warranty "A" Class Cells</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">{formData.panelQty} NOS</td>
                  <td className="p-2 border-b border-r border-white/10 font-medium whitespace-pre-wrap">{formData.panelMake.replace(/ /g, '\n')}</td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">2</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">
                    {formData.systemType === 'OFF GRID'
                      ? `MNRE APPROVED - ${formData.inverterCapacity} KW OFFGRID INVERTER WITH LITHIYAM IRON BATTERY SINGLE PHASE 8 + 2 Years Replacement warranty`
                      : `MNRE APPROVED ON GRID - ${formData.inverterCapacity} KVA THREE PHASE Inverter 10 Years Warranty WITH DONGLE`}
                  </td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">1 NO</td>
                  <td className="p-2 border-b border-r border-white/10 font-medium">{formData.inverterMake}</td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">3</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">GI STRUCTURE 4 X 3 1/2</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">1 LOT</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors bg-white/[0.02]">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">4</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">DCDB BOX WITH SURGE PROTECTION DEVICE</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">1 NO</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">5</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">DC CABLE 4 SQURE MM</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">As req.</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors bg-white/[0.02]">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">6</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">ACDB BOX WITH SURGE PROTECTION DEVICE</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">1 NO</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">7</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">AC CABLE</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">As req.</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors bg-white/[0.02]">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">8</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">EARTHING 3 FEET COPPER COATED IRON EARTH ROD</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">2</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">9</td>
                  <td className="p-2 border-b border-r border-white/10 text-left">LIGHTNING ARRESTOR C/W GI PIPE</td>
                  <td className="p-2 border-b border-r border-white/10 font-bold text-white">1</td>
                  <td className="p-2 border-b border-r border-white/10"></td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>

                {/* Totals Section */}
                <tr className="bg-white/5 text-white font-medium">
                  <td className="p-2 border-b border-r border-white/10 text-right uppercase tracking-wider" colSpan="4">Total</td>
                  <td className="p-2 border-b border-white/10 text-right">₹ {total.toLocaleString()}</td>
                </tr>
                {subsidy > 0 && (
                  <tr className="bg-white/5 text-white font-medium">
                    <td className="p-2 border-b border-r border-white/10 text-right uppercase tracking-wider" colSpan="4">SUBSIDY AMOUNT</td>
                    <td className="p-2 border-b border-white/10 text-right">₹ {subsidy.toLocaleString()}</td>
                  </tr>
                )}
                {gst > 0 && (
                  <tr className="bg-white/5 text-white font-medium">
                    <td className="p-2 border-b border-r border-white/10 text-right uppercase tracking-wider" colSpan="4">GST {formData.gstPercent}%</td>
                    <td className="p-2 border-b border-white/10 text-right">₹ {gst.toLocaleString()}</td>
                  </tr>
                )}
                <tr className="bg-white/10 text-white font-bold text-sm">
                  <td className="p-3 border-b border-r border-white/10 text-right uppercase tracking-widest text-red-400" colSpan="4">Grand Total</td>
                  <td className="p-3 border-b border-white/10 text-right text-red-400">₹ {grandTotal.toLocaleString()}</td>
                </tr>

                {/* Payment Terms */}
                <tr className="text-gray-400 text-xs">
                  <td className="p-2 border-b border-r border-white/10 text-left uppercase tracking-wider" colSpan="4">PER KW / Rs. {displayedPerKw.toLocaleString()}</td>
                  <td className="p-2 border-b border-white/10"></td>
                </tr>
                {formData.advPercent > 0 && (
                  <tr className="bg-black/20 text-gray-300 text-xs">
                    <td className="p-2 border-b border-r border-white/10 text-left uppercase tracking-wider" colSpan="4">MATERIAL DISPATCH BEFORE ADVANCE PAYMENT {formData.advPercent}%</td>
                    <td className="p-2 border-b border-white/10 text-right text-white font-medium">₹ {term1.toLocaleString()}</td>
                  </tr>
                )}
                {formData.secPercent > 0 && (
                  <tr className="bg-black/20 text-gray-300 text-xs">
                    <td className="p-2 border-b border-r border-white/10 text-left uppercase tracking-wider" colSpan="4">MATERIAL DISPATCH AFTER SECOND PAYMENT {formData.secPercent}%</td>
                    <td className="p-2 border-b border-white/10 text-right text-white font-medium">₹ {term2.toLocaleString()}</td>
                  </tr>
                )}
                {formData.thirdPercent > 0 && (
                  <tr className="bg-black/20 text-gray-300 text-xs">
                    <td className="p-2 border-b border-r border-white/10 text-left uppercase tracking-wider" colSpan="4">WORK COMPLETE AFTER LAST PAYMENT {formData.thirdPercent}%</td>
                    <td className="p-2 border-b border-white/10 text-right text-white font-medium">₹ {term3.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Signatures removed from Page 1, kept only on the last page */}
        </div>

        {/* PAGE 2 */}
        <div className="pt-8 print:break-before-page relative z-10 print:min-h-[250mm] flex flex-col justify-between">
          <div>
           <div className="mb-8">
              <div className="bg-gradient-to-r from-red-600/30 to-transparent border-l-2 border-red-500 px-4 py-1.5 inline-block mb-4 shadow-sm rounded-r-md">
                <span className="font-bold text-white tracking-widest uppercase">Terms & Conditions</span>
              </div>
              <ul className="list-none pl-4 space-y-2 text-gray-300 font-medium">
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Quotation valid up to 30 days only.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Installation work will take 1 TO 21 days & subject to change based on fitting constraint.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> The risk of loss attaching to the goods shall pass to customer with effect from the moment of delivery.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> 1 Years Free Service Support from SPC on date of installation completed.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> All our materials delivery to Client Site.</li>
              </ul>
           </div>

           <div className="mb-8">
              <div className="bg-gradient-to-r from-red-600/30 to-transparent border-l-2 border-red-500 px-4 py-1.5 inline-block mb-4 shadow-sm rounded-r-md">
                <span className="font-bold text-white tracking-widest uppercase">CLIENT SCOPE</span>
              </div>
              <ul className="list-none pl-4 space-y-2 text-gray-300 font-medium uppercase text-[10px]">
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Power and water should be provided by client.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Preparing the surface and cleaning is client scope.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Net meter Procurement and EB department follow up by client.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> GST {formData.gstPercent}% will extra as actual invoicing.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Material transportation charges Shall be paid by client.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> Civil Works and Excavation by Client Scope.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> NETMETER CHARGES IS CLIENT SCOPE. SINGLE PHASE 2575, THREE PHASE 4770.</li>
                <li className="flex items-start"><span className="text-red-500 mr-2">▪</span> DOCUMENT CHARGES 2500 WILL BE CLIENT SCOPE.</li>
              </ul>
           </div>

           <div className="mb-8 bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="bg-gradient-to-r from-blue-600/30 to-transparent border-l-2 border-blue-500 px-4 py-1.5 inline-block mb-4 shadow-sm rounded-r-md">
                <span className="font-bold text-white tracking-widest uppercase">OUR BANKER</span>
              </div>
              <div className="pl-4 font-medium space-y-2 text-gray-300">
                 <div className="grid grid-cols-[150px_auto]">
                   <p className="text-gray-400">COMPANY NAME</p><p className="text-white">: SPC SOLAR TECHNOLOGY</p>
                 </div>
                 <div className="grid grid-cols-[150px_auto]">
                   <p className="text-gray-400">BANK NAME</p><p className="text-white">: HDFC BANK</p>
                 </div>
                 <div className="grid grid-cols-[150px_auto]">
                   <p className="text-gray-400">ACCOUNT NO</p><p className="text-white">: 50200020555742</p>
                 </div>
                 <div className="grid grid-cols-[150px_auto]">
                   <p className="text-gray-400">BRANCH</p><p className="text-white">: RS PURAM BRANCH, COIMBATORE</p>
                 </div>
                 <div className="grid grid-cols-[150px_auto]">
                   <p className="text-gray-400">IFSC CODE</p><p className="text-white">: HDFC0000000</p>
                 </div>
              </div>
           </div>

           <div className="mb-8">
              <div className="bg-gradient-to-r from-green-600/30 to-transparent border-l-2 border-green-500 px-4 py-1.5 inline-block mb-4 shadow-sm rounded-r-md">
                <span className="font-bold text-white tracking-widest uppercase">SCAN TO PAY</span>
              </div>
              <div className="flex items-center gap-8 pl-4">
                 <div className="w-28 h-28 bg-white rounded-lg p-2 flex items-center justify-center font-bold text-gray-400 border-2 border-dashed border-gray-300">
                    [QR CODE]
                 </div>
                 <div className="font-bold">
                    <p className="text-gray-400 mb-1">G.PAY NUMBER</p>
                    <p className="text-2xl text-white tracking-widest">{formData.gpayNumber}</p>
                 </div>
              </div>
           </div>

           <div className="mb-16">
              <div className="text-center mb-4">
                <span className="font-bold text-gray-500 tracking-widest uppercase text-xs">AUTHORIZED CHANNEL PARTNERS</span>
              </div>
              <div className="flex justify-center gap-12 font-bold text-gray-600 italic">
                 <span>KIRLOSKAR</span>
                 <span>LUMINOUS</span>
                 <span>AUTOBAT</span>
                 <span>WAAREE</span>
              </div>
           </div>
          </div>

           <div className="flex justify-between items-end font-medium px-8 mt-auto pt-8">
            <div className="bg-white rounded-lg shadow-sm p-4 pt-16 w-48 text-center text-gray-800 uppercase tracking-widest">
              <div className="w-full border-b border-gray-400 mb-2"></div>
              <p className="text-[9px] font-bold">CUSTOMER SIGNATURE</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 pt-16 w-56 text-center text-gray-800 uppercase tracking-widest">
              <div className="w-full border-b border-gray-400 mb-2"></div>
              <p className="text-[9px] font-bold">SPC SOLAR OFFICE SIGNATURE</p>
            </div>
          </div>
          
        </div>

      </div>

      <style jsx>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body, html {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background-color: #0f172a !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminQuotationMaker;
