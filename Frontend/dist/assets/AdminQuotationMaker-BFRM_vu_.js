import{f as B,u as V,r as p,j as e,z as g}from"./vendor-react-BfwLuDy0.js";import{B as f,I as n,h as G,b as u}from"./index-jSTYVW-A.js";import{P as Q,ac as H,a6 as W,a2 as F,q as $,aj as z,ai as _,$ as k}from"./vendor-icons-jgC7Eq8j.js";import"./vendor-pdf-xC18v49Y.js";import"./vendor-motion-CaPX2pM_.js";const re=()=>{const[i]=B(),w=V(),[M,T]=p.useState([]),[m,S]=p.useState(i.get("leadId")||""),[j,v]=p.useState(!1),L=`QSP${Math.floor(1e3+Math.random()*9e3)}`,[r,x]=p.useState({refNo:L,date:new Date().toLocaleDateString("en-GB").replace(/\//g,"."),toName:i.get("name")||"CUSTOMER NAME",phone:i.get("phone")||"",toAddressLine1:i.get("phone")?`Phone: ${i.get("phone")}`:"STREET ADDRESS",toAddressLine2:i.get("city")?`${i.get("city")}${i.get("state")?", "+i.get("state"):""}`:"COIMBATORE, TAMIL NADU",kwSize:Number(i.get("kw"))||100,systemType:"ON GRID",panelQty:182,panelMake:"EASTMAN/ADDO WAAREE/EMMVEE/LUMINOUS/KIRLOSHKAR",inverterCapacity:100,inverterMake:"POLYCAB EASTMAN/ADDO",pricePerKw:48e3,gstPercent:5,subsidyAmount:0,advPercent:10,secPercent:70,thirdPercent:20,gpayNumber:"8489644044"}),O={1:{panelQty:2,panelMake:`EASTMAN/EMMVEE
ADDO/VIKRAM SOLAR
KIRLOSKAR/LUMINOUS`,inverterCapacity:1,inverterMake:`ADDO
POLYCAB/EASTMAN`,pricePerKw:102e3,subsidy:3e4,gst:0,adv:100,sec:0,third:0},2:{panelQty:4,panelMake:`EMMVEE/EASTMAN
ADDO/VIKRAM SOLAR
KIRLOSKAR/LUMINOUS`,inverterCapacity:3,inverterMake:`ADDO
POLYCAB/EASTMAN`,pricePerKw:9e4,subsidy:6e4,gst:0,adv:80,sec:20,third:0},3:{panelQty:6,panelMake:`ADDO/EMMVEE
EASTMAN/VIKRAM SOLAR
UTL/KIRLOSKAR
LUMINOUS`,inverterCapacity:3,inverterMake:`ADDO
EASTMAN/POLYCAB`,pricePerKw:76e3,subsidy:78e3,gst:0,adv:80,sec:20,third:0},4:{panelQty:7,panelMake:`EMMVEE/ADDO/EASTMAN/
VIKRAM SOLAR
KIRLOSKAR/LUMINOUS/UTL`,inverterCapacity:5,inverterMake:"EASTMAN/ADDO",pricePerKw:68750,subsidy:78e3,gst:0,adv:80,sec:20,third:0},5:{panelQty:9,panelMake:`ADDO/EASTMAN/
KIRLOSKAR/PANASONIC/
LUMINOUS/UTL`,inverterCapacity:5,inverterMake:"EASTMAN/POLYCAB",pricePerKw:66900,subsidy:78e3,gst:0,adv:80,sec:20,third:0},6:{panelQty:11,panelMake:`ADDO/EASTMAN/KIRLOSKAR/
EMMVEE
VIKRAM SOLAR/LUMINOUS/UTL`,inverterCapacity:7,inverterMake:`EASTMAN/ADDO
POLYCAB`,pricePerKw:65916.67,subsidy:78e3,gst:0,adv:80,sec:20,third:0},7:{panelQty:13,panelMake:`EASTMAN/ADDO
EMMVEE/WAAREE/
LUMINOUS/KIRLOSKAR`,inverterCapacity:7,inverterMake:"EASTMAN/ADDO",pricePerKw:64857.14,subsidy:78e3,gst:0,adv:80,sec:20,third:0},8:{panelQty:15,panelMake:`EASTMAN/ADDO
EMMVEE/LUMINOUS/
KIRLOSHKAR/UTL`,inverterCapacity:8,inverterMake:"EASTMAN/ADDO",pricePerKw:64275,subsidy:78e3,gst:0,adv:20,sec:70,third:10},9:{panelQty:16,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:10,inverterMake:"EASTMAN/ADDO",pricePerKw:62544.44,subsidy:78e3,gst:0,adv:80,sec:20,third:0},10:{panelQty:18,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:10,inverterMake:"EASTMAN/ADDO",pricePerKw:62e3,subsidy:78e3,gst:0,adv:80,sec:20,third:0},15:{panelQty:27,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE
LUMINOUS/
KIRLOSHKAR`,inverterCapacity:15,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:55e3,subsidy:0,gst:5,adv:10,sec:70,third:20},20:{panelQty:36,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:20,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:55e3,subsidy:0,gst:5,adv:10,sec:70,third:20},25:{panelQty:46,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:25,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:55e3,subsidy:0,gst:5,adv:10,sec:70,third:20},30:{panelQty:55,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:30,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:54e3,subsidy:0,gst:5,adv:10,sec:70,third:20},35:{panelQty:64,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:40,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:53e3,subsidy:0,gst:5,adv:10,sec:70,third:20},40:{panelQty:73,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:40,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:53e3,subsidy:0,gst:5,adv:10,sec:70,third:20},50:{panelQty:91,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:50,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:53e3,subsidy:0,gst:5,adv:10,sec:70,third:20},60:{panelQty:109,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:60,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:48e3,subsidy:0,gst:5,adv:10,sec:70,third:20},70:{panelQty:127,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:70,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:48e3,subsidy:0,gst:5,adv:10,sec:70,third:20},80:{panelQty:146,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:80,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:48e3,subsidy:0,gst:5,adv:10,sec:70,third:20},90:{panelQty:164,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:90,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:48e3,subsidy:0,gst:5,adv:10,sec:70,third:20},100:{panelQty:182,panelMake:`EASTMAN/ADDO
WAAREE/EMMVEE/LUMINOUS/
KIRLOSHKAR`,inverterCapacity:100,inverterMake:`POLYCAB
EASTMAN/ADDO`,pricePerKw:48e3,subsidy:0,gst:5,adv:10,sec:70,third:20}},R={1:{panelQty:2,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:1,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:9e4,subsidy:0,gst:5,adv:100,sec:0,third:0},2:{panelQty:4,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:3,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},3:{panelQty:5,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:3,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},4:{panelQty:7,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:5,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},5:{panelQty:9,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:5,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},6:{panelQty:10,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:6,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},7:{panelQty:12,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:7,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},8:{panelQty:14,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:8,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},9:{panelQty:16,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:9,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20},10:{panelQty:17,panelMake:`ADDO/EASTMAN
EMMVEE/UTL
VIKRAM SOLAR
WAAREE
KIRLOASKAR`,inverterCapacity:10,inverterMake:`SPC SOLAR
LITHIYAM
BATTERY/
NEXION ENERGY`,pricePerKw:8e4,subsidy:0,gst:5,adv:10,sec:70,third:20}};p.useEffect(()=>{(async()=>{var a;try{const d=await u.get("/leads"),b=((a=d.data)==null?void 0:a.leads)||(Array.isArray(d.data)?d.data:[]);T(b)}catch(d){console.error("Failed to load leads list",d)}})()},[]),p.useEffect(()=>{let t=null;r.systemType==="ON GRID"&&O[r.kwSize]?t=O[r.kwSize]:r.systemType==="OFF GRID"&&R[r.kwSize]&&(t=R[r.kwSize]),t&&x(a=>({...a,panelQty:t.panelQty,panelMake:t.panelMake,inverterCapacity:t.inverterCapacity,inverterMake:t.inverterMake,pricePerKw:t.pricePerKw,gstPercent:t.gst,subsidyAmount:t.subsidy,advPercent:t.adv,secPercent:t.sec,thirdPercent:t.third}))},[r.kwSize,r.systemType]);const P=t=>{if(S(t),!t){x(d=>({...d,toName:"OFFLINE CUSTOMER",phone:"",toAddressLine1:"STREET ADDRESS",toAddressLine2:"COIMBATORE, TAMIL NADU"}));return}const a=M.find(d=>d._id===t);a&&(x(d=>({...d,toName:a.name||"CUSTOMER NAME",phone:a.phone||"",toAddressLine1:a.phone?`Phone: ${a.phone}`:"Site Address",toAddressLine2:`${a.city||"Coimbatore"}${a.state?", "+a.state:", Tamil Nadu"}`})),g.success(`Loaded details for ${a.name||a.phone}`))},s=t=>{x({...r,[t.target.name]:t.target.value})},C=()=>{window.print()},I=()=>{S(""),x({refNo:`QSP${Math.floor(1e3+Math.random()*9e3)}`,date:new Date().toLocaleDateString("en-GB").replace(/\//g,"."),toName:"OFFLINE CUSTOMER",phone:"",toAddressLine1:"STREET ADDRESS",toAddressLine2:"COIMBATORE, TAMIL NADU",kwSize:5,systemType:"ON GRID",panelQty:9,panelMake:"EASTMAN/ADDO WAAREE/EMMVEE/LUMINOUS/KIRLOSHKAR",inverterCapacity:5,inverterMake:"EASTMAN/POLYCAB",pricePerKw:66900,gstPercent:0,subsidyAmount:78e3,advPercent:80,secPercent:20,thirdPercent:0,gpayNumber:"8489644044"}),g.success("Ready for Offline Client Quotation")},y=Number(r.kwSize)||0,D=Number(r.pricePerKw)||0,l=Math.round(y*D),o=Number(r.subsidyAmount)||0,h=Math.round(l*((Number(r.gstPercent)||0)/100)),c=l-o+h,A=Math.round(c*(Number(r.advPercent)||0)/100),N=Math.round(c*(Number(r.secPercent)||0)/100),E=Math.round(c*(Number(r.thirdPercent)||0)/100),K=y>0?Math.round((l-o)/y):0,U=async()=>{v(!0);try{const t={name:r.toName,phone:r.phone||"9876543210",location:r.toAddressLine2,recommendedKW:r.kwSize,connectionType:r.systemType,panelModel:r.panelMake,panelCount:r.panelQty,inverterModel:r.inverterMake,estimatedCost:l,centralSubsidy:o,netCost:c,status:"Sent",adminNotes:`Quotation Ref: ${r.refNo} generated via Admin Quotation Maker. Advance: Rs. ${A}, Second: Rs. ${N}, Final: Rs. ${E}.`};await u.post("/quotations",t),g.success("Quotation successfully saved to database!"),m&&await u.put(`/leads/${m}`,{status:"Quoted"}).catch(()=>{})}catch{g.error("Failed to save quotation")}finally{v(!1)}},Y=()=>{const a=(r.phone||"").replace(/\D/g,""),d=a.startsWith("91")?a:`91${a}`,b=`Hello *${r.toName}*! ☀️

Greetings from *SPC Solar Technology*!
Here is your customized quotation (*Ref: ${r.refNo}*):

⚡ *System Size:* ${r.kwSize} KW (${r.systemType})
📦 *PV Modules:* ${r.panelQty} Nos (${r.panelMake.replace(/\n/g," ")})
🔌 *Inverter:* ${r.inverterCapacity} KVA (${r.inverterMake.replace(/\n/g," ")})

💵 *Total System Cost:* ₹${l.toLocaleString()}
🏛️ *Govt Subsidy:* -₹${o.toLocaleString()}
🧾 *Net Investment:* *₹${c.toLocaleString()}*

💳 *Payment Milestones:*
1. Material Dispatch / Advance (${r.advPercent}%): ₹${A.toLocaleString()}
2. Second Stage (${r.secPercent}%): ₹${N.toLocaleString()}
3. Work Completion (${r.thirdPercent}%): ₹${E.toLocaleString()}

📞 Contact: 80987 44044 (Office) / 84896 44044
🌐 Website: SPC Solar Technology`;a?window.open(`https://wa.me/${d}?text=${encodeURIComponent(b)}`,"_blank"):window.open(`https://wa.me/?text=${encodeURIComponent(b)}`,"_blank")};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm print:hidden",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxs("button",{onClick:()=>w("/admin/leads"),className:"text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 mr-2 px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors",children:[e.jsx(Q,{})," Back to Customer Leads"]}),e.jsx("span",{className:"text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 uppercase",children:m?"Online Lead Mode":"Offline / Custom Client"})]}),e.jsxs("h2",{className:"text-2xl md:text-3xl font-heading font-bold text-gray-900 flex items-center gap-2",children:[e.jsx(H,{className:"text-red-600"})," Pro Quotation Maker (2-Sided View)"]}),e.jsx("p",{className:"text-xs text-gray-500 font-body",children:"Front and Back sides displayed side-by-side on screen. Edit parameters, save, or download as official 2-page PDF."})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2.5 w-full lg:w-auto",children:[e.jsxs(f,{variant:"outline",onClick:I,className:"text-xs flex items-center gap-1.5",title:"Start blank quotation for a walk-in / offline client",children:[e.jsx(W,{})," New Offline Client"]}),e.jsxs(f,{variant:"outline",onClick:U,disabled:j,className:"text-xs flex items-center gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50",children:[e.jsx(F,{})," ",j?"Saving...":"Save to System"]}),e.jsxs("button",{onClick:Y,className:"inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-btn text-xs font-bold font-accent shadow-sm transition-colors",children:[e.jsx($,{size:15})," Send WhatsApp"]}),e.jsxs(f,{variant:"primary",onClick:C,className:"text-xs flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white shadow-md",children:[e.jsx(z,{})," Print / Save as PDF"]})]})]}),e.jsxs("div",{className:"bg-gradient-to-r from-gray-900 to-black text-white p-5 rounded-2xl shadow-md border border-gray-800 print:hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0",children:e.jsx(_,{size:20})}),e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-bold text-white uppercase tracking-wider",children:r.toName||"Select Client"}),e.jsxs("p",{className:"text-xs text-gray-300 font-body",children:[r.phone?`Phone: ${r.phone}`:"Walk-in / Offline Client"," • ",r.toAddressLine2]})]})]}),e.jsxs("div",{className:"flex items-center gap-2 w-full md:w-auto",children:[e.jsx("span",{className:"text-xs text-gray-400 font-semibold whitespace-nowrap",children:"Load Customer Lead:"}),e.jsxs("select",{value:m,onChange:t=>P(t.target.value),className:"bg-gray-800 text-white border border-gray-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-red-500 cursor-pointer w-full md:w-64",children:[e.jsx("option",{value:"",children:"👤 Manual / Offline Client"}),M.map(t=>e.jsx("option",{value:t._id,children:t.name?`${t.name} (${t.phone||t.city})`:`Lead: ${t.phone}`},t._id))]})]})]}),e.jsxs("div",{className:"bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4",children:[e.jsx(n,{label:"Reference No",name:"refNo",value:r.refNo,onChange:s}),e.jsx(n,{label:"Date",name:"date",value:r.date,onChange:s}),e.jsx(n,{label:"Customer Full Name",name:"toName",value:r.toName,onChange:s}),e.jsx(n,{label:"Phone Number",name:"phone",value:r.phone,onChange:s,placeholder:"e.g. 9876543210"}),e.jsx(n,{label:"Address Line 1",name:"toAddressLine1",value:r.toAddressLine1,onChange:s}),e.jsx(n,{label:"Address Line 2 (City, State)",name:"toAddressLine2",value:r.toAddressLine2,onChange:s}),e.jsx(n,{label:"System KW Size",name:"kwSize",type:"number",value:r.kwSize,onChange:s}),e.jsxs("div",{className:"flex flex-col w-full mb-4",children:[e.jsx("label",{className:"mb-1.5 font-sans font-semibold text-xs uppercase tracking-wider text-gray-700",children:"System Type"}),e.jsxs("select",{name:"systemType",value:r.systemType,onChange:s,className:"w-full px-4 py-3 text-sm font-sans outline-none transition-all duration-200 rounded-md bg-white text-black border border-gray-200 hover:border-gray-400 focus:border-black cursor-pointer appearance-none",style:{backgroundImage:'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',backgroundRepeat:"no-repeat",backgroundPosition:"right 1rem top 50%",backgroundSize:"0.65rem auto"},children:[e.jsx("option",{value:"ON GRID",children:"ON GRID"}),e.jsx("option",{value:"OFF GRID",children:"OFF GRID"}),e.jsx("option",{value:"HYBRID",children:"HYBRID"})]})]}),e.jsx(n,{label:"Price Per KW (Rs)",name:"pricePerKw",type:"number",value:r.pricePerKw,onChange:s}),e.jsx(n,{label:"Govt Subsidy Amount (Rs)",name:"subsidyAmount",type:"number",value:r.subsidyAmount,onChange:s}),e.jsx(n,{label:"GST %",name:"gstPercent",type:"number",value:r.gstPercent,onChange:s}),e.jsx(n,{label:"Panel Qty (NOS)",name:"panelQty",type:"number",value:r.panelQty,onChange:s}),e.jsx(n,{label:"Panel Make",name:"panelMake",value:r.panelMake,onChange:s}),e.jsx(n,{label:"Inverter Capacity (KVA)",name:"inverterCapacity",type:"number",value:r.inverterCapacity,onChange:s}),e.jsx(n,{label:"Inverter Make",name:"inverterMake",value:r.inverterMake,onChange:s}),e.jsx(n,{label:"Advance Payment %",name:"advPercent",type:"number",value:r.advPercent,onChange:s}),e.jsx(n,{label:"Second Payment %",name:"secPercent",type:"number",value:r.secPercent,onChange:s}),e.jsx(n,{label:"Final Payment %",name:"thirdPercent",type:"number",value:r.thirdPercent,onChange:s}),e.jsx(n,{label:"GPay Number",name:"gpayNumber",value:r.gpayNumber,onChange:s})]}),e.jsxs("div",{className:"print-quotation-wrapper grid grid-cols-1 xl:grid-cols-2 gap-8 w-full max-w-[1700px] mx-auto print:block print:w-[210mm] print:max-w-none print:gap-0 print:m-0 print:p-0",children:[e.jsxs("div",{className:"flex flex-col print:block print:m-0 print:p-0 print:w-[210mm]",children:[e.jsxs("div",{className:"print:hidden mb-3 flex items-center justify-between px-2",children:[e.jsxs("span",{className:"text-xs font-bold font-accent tracking-wider uppercase bg-red-600 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm",children:[e.jsx(k,{})," ",e.jsx("span",{children:"FRONT SIDE"})," ",e.jsx("span",{className:"opacity-80 font-normal",children:"(PAGE 1 - SPECS & PRICING)"})]}),e.jsxs("span",{className:"text-xs text-gray-500 font-mono font-bold",children:["Ref: ",r.refNo]})]}),e.jsx("div",{className:"print-page print-page-1 bg-white text-gray-900 p-5 sm:p-6 print:p-[10mm_12mm] w-full h-[297mm] min-h-[297mm] max-h-[297mm] shadow-2xl print:shadow-none font-sans text-[11px] leading-normal relative rounded-2xl print:rounded-none border border-gray-200 flex flex-col justify-between overflow-hidden",children:e.jsxs("div",{className:"relative z-10 flex-1 flex flex-col justify-between h-full",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-start mb-2 sm:mb-2.5",children:[e.jsxs("div",{className:"font-medium text-[10.5px] uppercase leading-relaxed text-gray-700 tracking-wider",children:[e.jsx("p",{className:"font-black text-base tracking-wide mb-0.5 text-red-600",children:"SPC SOLAR TECHNOLOGY"}),e.jsx("p",{className:"text-gray-700 leading-snug",children:"No-115-117, Easwari Towers,"}),e.jsx("p",{className:"text-gray-700 leading-snug",children:"Devanga High School Road, RS Puram,"}),e.jsx("p",{className:"text-gray-700 leading-snug",children:"Coimbatore - 641002."}),e.jsx("p",{className:"mt-0.5 text-red-600 font-bold tracking-wide",children:"MOBILE: 80987 44044 (Office), 84896 44044"}),e.jsx("p",{className:"text-red-600 font-medium",children:"spctechnologycoimbatore@gmail.com"})]}),e.jsx("div",{className:"text-right flex flex-col items-end",children:e.jsx("div",{className:"bg-white p-1.5 rounded-xl shadow-xs border border-gray-200",children:e.jsx("img",{src:G,alt:"SPC Solar Logo",className:"w-24 sm:w-28 object-contain"})})})]}),e.jsxs("div",{className:"text-center my-1.5 sm:my-2",children:[e.jsxs("h1",{className:"text-lg sm:text-xl font-black tracking-widest uppercase text-red-600 drop-shadow-xs",children:[r.systemType," QUOTATION"]}),e.jsx("div",{className:"h-0.5 w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto mt-0.5"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-2 sm:mb-2.5 bg-gray-50/80 p-2.5 sm:p-3 rounded-xl border border-gray-200 text-[10.5px] shadow-xs",children:[e.jsxs("div",{className:"uppercase",children:[e.jsx("p",{className:"text-red-600 text-[9px] font-bold tracking-widest mb-0.5",children:"BILL TO"}),e.jsx("p",{className:"font-bold text-black text-xs sm:text-sm tracking-wide",children:r.toName}),e.jsx("p",{className:"text-gray-700 text-[10px] mt-0.5 leading-snug",children:r.toAddressLine1}),e.jsx("p",{className:"text-gray-700 text-[10px] leading-snug",children:r.toAddressLine2})]}),e.jsxs("div",{className:"text-right uppercase",children:[e.jsx("p",{className:"text-red-600 text-[9px] font-bold tracking-widest mb-0.5",children:"PROPOSAL DETAILS"}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500 mr-2",children:"REF:"})," ",e.jsx("span",{className:"font-mono font-bold text-black",children:r.refNo})]}),e.jsxs("p",{children:[e.jsx("span",{className:"text-gray-500 mr-2",children:"DATE:"})," ",e.jsx("span",{className:"font-bold text-black",children:r.date})]}),e.jsxs("p",{className:"mt-0.5",children:[e.jsx("span",{className:"text-gray-500 mr-2",children:"SYSTEM:"})," ",e.jsxs("span",{className:"font-black text-red-600 text-xs sm:text-sm",children:[r.kwSize," KW (",r.systemType,")"]})]})]})]}),e.jsx("div",{className:"rounded-xl overflow-hidden border border-gray-300 bg-white shadow-sm mb-2",children:e.jsxs("table",{className:"w-full text-center border-collapse",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100 text-gray-900 font-bold tracking-wider text-[9.5px] uppercase border-b border-gray-300",children:[e.jsx("th",{className:"py-1 px-2 border-b border-r border-gray-300 w-8",children:"#"}),e.jsx("th",{className:"py-1 px-3 border-b border-r border-gray-300 text-left",children:"Capital Expenditure (per MWp)"}),e.jsx("th",{className:"py-1 px-2 border-b border-r border-gray-300 w-20",children:"Qty"}),e.jsx("th",{className:"py-1 px-3 border-b border-r border-gray-300 w-44",children:"Make"}),e.jsx("th",{className:"py-1 px-3 border-b border-gray-300 w-28",children:"INR"})]})}),e.jsxs("tbody",{className:"text-gray-800 text-[9.5px]",children:[e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"1"}),e.jsxs("td",{className:"py-1 px-3 border-r border-gray-200 text-left leading-snug text-gray-900",children:["PV Modules – ",r.systemType==="OFF GRID"?"580":"550",' Watts-Mono Perc Ofcut Bifacial - MNRE Approved - 25 Years warranty "A" Class Cells']}),e.jsxs("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:[r.panelQty," NOS"]}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 font-semibold text-black leading-snug",children:r.panelMake}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"2"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left leading-snug text-gray-900",children:r.systemType==="OFF GRID"?`MNRE APPROVED - ${r.inverterCapacity} KW OFFGRID INVERTER WITH LITHIYAM IRON BATTERY SINGLE PHASE 8 + 2 Years Replacement warranty`:`MNRE APPROVED ON GRID - ${r.inverterCapacity} KVA THREE PHASE Inverter 10 Years Warranty WITH DONGLE`}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"1 NO"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 font-semibold text-black leading-snug",children:r.inverterMake}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"3"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"GI STRUCTURE 4 X 3 1/2"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"1 LOT"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors bg-gray-50/50 border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"4"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"DCDB BOX WITH SURGE PROTECTION DEVICE"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"1 NO"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"5"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"DC CABLE 4 SQURE MM"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"As req."}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors bg-gray-50/50 border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"6"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"ACDB BOX WITH SURGE PROTECTION DEVICE"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"1 NO"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"7"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"AC CABLE"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"As req."}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors bg-gray-50/50 border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"8"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"EARTHING 3 FEET COPPER COATED IRON ROD"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"2"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"hover:bg-gray-50 transition-colors border-b border-gray-200",children:[e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"9"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200 text-left text-gray-900",children:"LIGHTNING ARRESTOR C/W GI PIPE"}),e.jsx("td",{className:"py-1 px-2 border-r border-gray-200 font-bold text-black",children:"1"}),e.jsx("td",{className:"py-1 px-3 border-r border-gray-200"}),e.jsx("td",{className:"py-1 px-3"})]}),e.jsxs("tr",{className:"bg-gray-50 text-gray-900 font-bold border-b border-gray-300",children:[e.jsx("td",{className:"py-1 px-3 border-r border-gray-300 text-right uppercase tracking-wider text-[9.5px]",colSpan:"4",children:"TOTAL SYSTEM COST"}),e.jsxs("td",{className:"py-1 px-3 text-right font-bold text-black text-[10.5px]",children:["₹ ",l.toLocaleString()]})]}),o>0&&e.jsxs("tr",{className:"bg-emerald-50 text-emerald-800 font-bold border-b border-gray-300",children:[e.jsx("td",{className:"py-0.5 px-3 border-r border-gray-300 text-right uppercase tracking-wider text-[9.5px] text-emerald-700",colSpan:"4",children:"CENTRAL GOVT. SUBSIDY"}),e.jsxs("td",{className:"py-0.5 px-3 text-right text-emerald-700 font-bold text-[10.5px]",children:["- ₹ ",o.toLocaleString()]})]}),h>0&&e.jsxs("tr",{className:"bg-gray-50 text-gray-900 font-semibold border-b border-gray-300",children:[e.jsxs("td",{className:"py-0.5 px-3 border-r border-gray-300 text-right uppercase tracking-wider text-[9.5px]",colSpan:"4",children:["GST ",r.gstPercent,"%"]}),e.jsxs("td",{className:"py-0.5 px-3 text-right text-gray-900 text-[10.5px]",children:["₹ ",h.toLocaleString()]})]}),e.jsxs("tr",{className:"bg-red-50 text-red-600 font-black text-xs border-b border-t-2 border-red-500",children:[e.jsx("td",{className:"py-1.5 px-3 border-r border-gray-300 text-right uppercase tracking-widest text-red-600 text-xs sm:text-[12.5px]",colSpan:"4",children:"GRAND TOTAL (NET INVESTMENT)"}),e.jsxs("td",{className:"py-1.5 px-3 text-right text-red-600 font-black text-sm sm:text-base",children:["₹ ",c.toLocaleString()]})]}),e.jsxs("tr",{className:"text-gray-700 text-[9px] border-b border-gray-200 bg-white",children:[e.jsxs("td",{className:"py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-semibold",colSpan:"4",children:["RATE PER KW: ₹ ",K.toLocaleString()," / KW"]}),e.jsx("td",{className:"py-0.5 px-3"})]}),r.advPercent>0&&e.jsxs("tr",{className:"bg-gray-50/80 text-gray-800 text-[9px] border-b border-gray-200",children:[e.jsxs("td",{className:"py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-medium",colSpan:"4",children:["ADVANCE PAYMENT (",r.advPercent,"%)"]}),e.jsxs("td",{className:"py-0.5 px-3 text-right text-black font-bold",children:["₹ ",A.toLocaleString()]})]}),r.secPercent>0&&e.jsxs("tr",{className:"bg-gray-50/80 text-gray-800 text-[9px] border-b border-gray-200",children:[e.jsxs("td",{className:"py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-medium",colSpan:"4",children:["SECOND STAGE PAYMENT (",r.secPercent,"%)"]}),e.jsxs("td",{className:"py-0.5 px-3 text-right text-black font-bold",children:["₹ ",N.toLocaleString()]})]}),r.thirdPercent>0&&e.jsxs("tr",{className:"bg-gray-50/80 text-gray-800 text-[9px]",children:[e.jsxs("td",{className:"py-0.5 px-3 border-r border-gray-200 text-left uppercase tracking-wider font-medium",colSpan:"4",children:["WORK COMPLETION PAYMENT (",r.thirdPercent,"%)"]}),e.jsxs("td",{className:"py-0.5 px-3 text-right text-black font-bold",children:["₹ ",E.toLocaleString()]})]})]})]})})]}),e.jsxs("div",{className:"mt-auto pt-2",children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("div",{className:"text-center mb-1",children:e.jsx("span",{className:"font-bold text-gray-700 tracking-widest uppercase text-[9.5px]",children:"AUTHORIZED CHANNEL PARTNERS"})}),e.jsxs("div",{className:"flex flex-wrap justify-center gap-2 font-bold text-gray-900 italic text-[10px]",children:[e.jsx("span",{className:"px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md",children:"KIRLOSKAR"}),e.jsx("span",{className:"px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md",children:"LUMINOUS"}),e.jsx("span",{className:"px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md",children:"AUTOBAT"}),e.jsx("span",{className:"px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md",children:"WAAREE"}),e.jsx("span",{className:"px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md",children:"EASTMAN"}),e.jsx("span",{className:"px-3 py-0.5 bg-gray-100 border border-gray-300 rounded-md",children:"POLYCAB"})]})]}),e.jsxs("div",{className:"text-center text-[10px] text-gray-500 border-t border-gray-200 pt-1.5 flex justify-between items-center",children:[e.jsx("span",{children:"SPC Solar Technology • Official Proposal"}),e.jsx("span",{className:"font-mono",children:"Page 1 of 2 (Front Side)"})]})]})]})})]}),e.jsxs("div",{className:"flex flex-col mt-8 xl:mt-0 print:block print:m-0 print:p-0 print:w-[210mm]",children:[e.jsxs("div",{className:"print:hidden mb-3 flex items-center justify-between px-2",children:[e.jsxs("span",{className:"text-xs font-bold font-accent tracking-wider uppercase bg-blue-600 text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 shadow-sm",children:[e.jsx(k,{})," ",e.jsx("span",{children:"BACK SIDE"})," ",e.jsx("span",{className:"opacity-80 font-normal",children:"(PAGE 2 - TERMS & BANKING)"})]}),e.jsx("span",{className:"text-xs text-gray-500 font-mono font-bold",children:"SPC Solar Guarantee"})]}),e.jsx("div",{className:"print-page print-page-2 bg-white text-gray-900 p-5 sm:p-6 print:p-[10mm_12mm] w-full h-[297mm] min-h-[297mm] max-h-[297mm] shadow-2xl print:shadow-none font-sans text-[11px] leading-normal relative rounded-2xl print:rounded-none border border-gray-200 flex flex-col justify-between overflow-hidden",children:e.jsxs("div",{className:"relative z-10 flex-1 flex flex-col justify-between h-full",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("div",{className:"bg-red-50 border-l-4 border-red-600 px-3 py-1 inline-block mb-2 shadow-xs rounded-r-md",children:e.jsx("span",{className:"font-bold text-red-600 tracking-widest uppercase text-xs",children:"Terms & Conditions"})}),e.jsxs("ul",{className:"list-none pl-2 space-y-1.5 text-gray-800 font-medium text-[10.5px] leading-relaxed",children:[e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Quotation valid up to 30 days only from the date of issue."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Installation work will take 1 TO 21 days & subject to change based on fitting constraint."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," The risk of loss attaching to the goods shall pass to customer with effect from the moment of delivery."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," 1 Year Free Service Support from SPC on date of installation completed."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," All our materials delivery directly to Client Site."]})]})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("div",{className:"bg-red-50 border-l-4 border-red-600 px-3 py-1 inline-block mb-2 shadow-xs rounded-r-md",children:e.jsx("span",{className:"font-bold text-red-600 tracking-widest uppercase text-xs",children:"CLIENT SCOPE"})}),e.jsxs("ul",{className:"list-none pl-2 space-y-1 text-gray-800 font-medium uppercase text-[10px] leading-relaxed",children:[e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Power and water should be provided by client during installation."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Preparing the roof surface and cleaning is client scope."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Net meter Procurement and EB department follow up by client."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," GST ",r.gstPercent,"% will extra as actual invoicing."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Material transportation charges shall be paid by client."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," Civil Works and Excavation by Client Scope."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," NETMETER CHARGES IS CLIENT SCOPE. SINGLE PHASE 2575, THREE PHASE 4770."]}),e.jsxs("li",{className:"flex items-start",children:[e.jsx("span",{className:"text-red-600 mr-2.5 font-bold",children:"▪"})," DOCUMENT CHARGES 2500 WILL BE CLIENT SCOPE."]})]})]}),e.jsxs("div",{className:"mb-4 bg-gray-50/80 p-3.5 sm:p-4 rounded-xl border border-gray-300 shadow-xs",children:[e.jsx("div",{className:"bg-blue-50 border-l-4 border-blue-600 px-3 py-1 inline-block mb-2.5 shadow-xs rounded-r-md",children:e.jsx("span",{className:"font-bold text-blue-900 tracking-widest uppercase text-xs",children:"OUR BANKER"})}),e.jsxs("div",{className:"pl-2 font-medium space-y-1 text-gray-800 text-[10.5px]",children:[e.jsxs("div",{className:"grid grid-cols-[140px_auto]",children:[e.jsx("p",{className:"text-gray-600 font-semibold",children:"COMPANY NAME"}),e.jsx("p",{className:"text-black font-bold",children:": SPC SOLAR TECHNOLOGY"})]}),e.jsxs("div",{className:"grid grid-cols-[140px_auto]",children:[e.jsx("p",{className:"text-gray-600 font-semibold",children:"BANK NAME"}),e.jsx("p",{className:"text-black font-bold",children:": HDFC BANK"})]}),e.jsxs("div",{className:"grid grid-cols-[140px_auto]",children:[e.jsx("p",{className:"text-gray-600 font-semibold",children:"ACCOUNT NO"}),e.jsx("p",{className:"text-black font-mono font-bold",children:": 50200020555742"})]}),e.jsxs("div",{className:"grid grid-cols-[140px_auto]",children:[e.jsx("p",{className:"text-gray-600 font-semibold",children:"BRANCH"}),e.jsx("p",{className:"text-black font-medium",children:": RS PURAM BRANCH, COIMBATORE"})]}),e.jsxs("div",{className:"grid grid-cols-[140px_auto]",children:[e.jsx("p",{className:"text-gray-600 font-semibold",children:"IFSC CODE"}),e.jsx("p",{className:"text-black font-mono font-bold",children:": HDFC0000000"})]})]})]}),e.jsx("div",{className:"mb-4 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-300 shadow-xs flex items-center justify-between",children:e.jsxs("div",{className:"flex items-center gap-4 pl-1",children:[e.jsx("div",{className:"w-18 h-18 bg-white rounded-xl p-2 flex items-center justify-center font-bold text-gray-900 border border-gray-300 shadow-sm",children:e.jsxs("div",{className:"text-center leading-tight",children:[e.jsx("div",{className:"text-xs font-black text-black tracking-wider",children:"UPI"}),e.jsx("div",{className:"text-[8px] font-bold text-red-600",children:"PAY"}),e.jsx("div",{className:"text-[7px] text-gray-600 font-mono",children:"SCAN QR"})]})}),e.jsxs("div",{children:[e.jsx("div",{className:"bg-emerald-100/70 border-l-3 border-emerald-600 px-2 py-0.5 inline-block mb-1 rounded-r-md",children:e.jsx("span",{className:"font-bold text-emerald-900 tracking-widest uppercase text-[10px]",children:"SCAN TO PAY (UPI)"})}),e.jsx("p",{className:"text-xs text-gray-600 font-semibold",children:"G.PAY / PHONEPE / ALL UPI"}),e.jsx("p",{className:"text-lg text-black font-mono font-black tracking-widest",children:r.gpayNumber}),e.jsx("p",{className:"text-[9.5px] text-emerald-700 font-semibold",children:"Accepts GPay, PhonePe, Paytm, BHIM & All UPI Apps"})]})]})})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex justify-between items-end font-medium px-4 pt-3 border-t border-gray-200",children:[e.jsxs("div",{className:"bg-gray-50 rounded-xl border border-gray-200 p-3 pt-10 w-44 text-center text-gray-800 uppercase tracking-wider",children:[e.jsx("div",{className:"w-full border-b border-gray-400 mb-1.5"}),e.jsx("p",{className:"text-[8.5px] font-bold text-gray-800",children:"CUSTOMER SIGNATURE"})]}),e.jsxs("div",{className:"bg-gray-50 rounded-xl border border-gray-200 p-3 pt-10 w-52 text-center text-gray-800 uppercase tracking-wider",children:[e.jsx("div",{className:"w-full border-b border-gray-400 mb-1.5"}),e.jsx("p",{className:"text-[8.5px] font-bold text-gray-800",children:"SPC SOLAR OFFICE SIGNATURE"})]})]}),e.jsxs("div",{className:"text-center text-[10px] text-gray-500 pt-2.5 mt-2 flex justify-between items-center border-t border-gray-200",children:[e.jsx("span",{children:"SPC Solar Technology • Official Proposal"}),e.jsx("span",{className:"font-mono",children:"Page 2 of 2 (Back Side)"})]})]})]})})]})]}),e.jsx("style",{children:`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 100% !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            overflow: visible !important;
          }
          nav, header, aside, .print\\:hidden {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            background: transparent !important;
          }
          .space-y-6 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
          }
          .print-quotation-wrapper {
            display: block !important;
            width: 210mm !important;
            max-width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            transform: none !important;
          }
          .print-page {
            box-sizing: border-box !important;
            overflow: hidden !important;
            border: none !important;
            border-radius: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .print-page-1 {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            min-height: 297mm !important;
            padding: 10mm 12mm !important;
            margin: 0 !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .print-page-2 {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            width: 210mm !important;
            height: 297mm !important;
            max-height: 297mm !important;
            min-height: 297mm !important;
            padding: 10mm 12mm !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            page-break-before: auto !important;
            break-before: auto !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `})]})};export{re as default};
