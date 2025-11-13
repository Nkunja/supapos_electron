"use strict";exports.id=5755,exports.ids=[5755],exports.modules={9254:(a,b,c)=>{c.d(b,{f:()=>n});var d=c(60687),e=c(43210),f=c(55192),g=c(24934),h=c(59821),i=c(13964),j=c(70615),k=c(31158),l=c(71444),m=c(11860);function n({invoice:a,onClose:b,onDownload:c,onPrint:n}){let[o,p]=(0,e.useState)(!1);if(!a)return null;let q=a=>new Date(a).toLocaleDateString("en-US",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),r=async()=>{try{let a=s();await navigator.clipboard.writeText(a),p(!0),setTimeout(()=>p(!1),2e3)}catch(a){console.error("Failed to copy to clipboard:",a)}},s=()=>{let b=["=".repeat(32),`    ${a.shop_name}`,`P.O. Box: ${a.shop_po_box||"N/A"}`,`Address: ${a.shop_address||"N/A"}`,`Phone: ${a.shop_phone_number||"N/A"}`,`KRA PIN: ${a.shop_kra_pin||"N/A"}`,"=".repeat(32),`Invoice: ${a.invoice_number}`,`Date: ${q(a.created_at)}`,`Customer: ${a.customer_name}`,`Phone: ${a.customer_phone||"N/A"}`,`Cashier: ${a.created_by_name}`,"-".repeat(32),"ITEMS:","-".repeat(32)];return a.items.forEach(a=>{b.push(`${a.product_name}`,`  ${a.quantity} \xd7 ${parseFloat(a.unit_price).toFixed(2)} = ${parseFloat(a.total_price).toFixed(2)}`)}),b.push("-".repeat(32),`Subtotal: ${parseFloat(a.subtotal).toFixed(2)}`,`Tax: ${parseFloat(a.tax_amount).toFixed(2)}`,`Discount: ${parseFloat(a.discount_amount).toFixed(2)}`,"=".repeat(32),`TOTAL: ${parseFloat(a.total_amount).toFixed(2)}`,`Paid: ${parseFloat(a.amount_paid).toFixed(2)}`,`Change: ${parseFloat(a.change_amount).toFixed(2)}`,"=".repeat(32),`Payment: ${a.payment_method_display}`,`Status: ${a.status_display}`,"",a.notes||"","","Thank you for your purchase!","=".repeat(32)),b.join("\n")};return(0,d.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4",children:(0,d.jsxs)(f.Zp,{className:"w-full max-w-2xl max-h-[90vh] overflow-hidden",children:[(0,d.jsxs)(f.aR,{className:"flex flex-row items-center justify-between space-y-0 pb-4",children:[(0,d.jsx)(f.ZB,{className:"text-lg",children:"Thermal Invoice Preview"}),(0,d.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,d.jsxs)(g.$,{size:"sm",variant:"outline",onClick:r,className:"flex items-center space-x-1",children:[o?(0,d.jsx)(i.A,{className:"h-4 w-4"}):(0,d.jsx)(j.A,{className:"h-4 w-4"}),(0,d.jsx)("span",{children:o?"Copied!":"Copy"})]}),(0,d.jsx)(g.$,{size:"sm",variant:"outline",onClick:()=>c(a),children:(0,d.jsx)(k.A,{className:"h-4 w-4"})}),(0,d.jsx)(g.$,{size:"sm",variant:"outline",onClick:()=>{let b=window.open("","_blank");b&&(b.document.write(`
        <html>
          <head>
            <title>Invoice ${a.invoice_number}</title>
            <style>
              @page {
                size: 80mm 297mm;
                margin: 0;
              }
              
              @media print {
                body {
                  width: 72mm;
                  max-width: 72mm;
                  margin: 0;
                  padding: 4mm;
                  font-family: monospace;
                  font-size: 11px;
                  line-height: 1.3;
                  transform: none !important;
                }
              }
              
              body { 
                font-family: monospace; 
                font-size: 11px; 
                margin: 0; 
                padding: 4mm;
                width: 72mm;
                max-width: 72mm;
                line-height: 1.3;
                background: white;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              
              .header { 
                text-align: center; 
                margin-bottom: 6px; 
                border-bottom: 1px dashed #000;
                padding-bottom: 6px;
              }
              
              .header h2 {
                margin: 0;
                font-size: 15px;
                font-weight: bold;
              }
              
              .header p {
                margin: 2px 0 0 0;
                font-size: 9px;
              }
              
              .divider { 
                border-top: 1px dashed #000; 
                margin: 3px 0; 
                height: 1px;
              }
              
              .item { 
                margin: 3px 0; 
                padding: 2px 0;
              }
              
              .item-name {
                font-weight: bold;
                font-size: 10px;
                margin-bottom: 1px;
                word-break: break-word;
              }
              
              .item-details {
                font-size: 9px;
                text-align: right;
                margin-top: 1px;
              }
              
              .total { 
                font-weight: bold; 
                margin-top: 6px; 
                border-top: 1px solid #000;
                padding-top: 3px;
              }
              
              .footer { 
                text-align: center; 
                margin-top: 6px; 
                border-top: 1px dashed #000;
                padding-top: 6px;
              }
              
              .info-row {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;
                font-size: 9px;
                align-items: flex-start;
              }
              
              .info-label {
                font-weight: bold;
                flex-shrink: 0;
                margin-right: 4px;
              }
              
              .info-value {
                text-align: right;
                flex: 1;
                word-break: break-all;
              }
              
              .items-section {
                margin: 6px 0;
                border-top: 1px dashed #000;
                border-bottom: 1px dashed #000;
                padding: 3px 0;
              }
              
              .items-header {
                text-align: center;
                font-weight: bold;
                font-size: 10px;
                margin-bottom: 3px;
              }
              
              .summary-section {
                margin: 6px 0;
              }
              
              .summary-row {
                display: flex;
                justify-content: space-between;
                margin: 1px 0;
                font-size: 9px;
                align-items: flex-start;
              }
              
              .summary-row span:first-child {
                flex-shrink: 0;
                margin-right: 4px;
              }
              
              .summary-row span:last-child {
                text-align: right;
                flex: 1;
              }
              
              .total-row {
                display: flex;
                justify-content: space-between;
                margin: 3px 0;
                font-size: 11px;
                font-weight: bold;
                border-top: 1px solid #000;
                padding-top: 3px;
                align-items: flex-start;
              }
              
              .total-row span:first-child {
                flex-shrink: 0;
                margin-right: 4px;
              }
              
              .total-row span:last-child {
                text-align: right;
                flex: 1;
              }
              
              .payment-info {
                margin: 6px 0;
                border-top: 1px dashed #000;
                padding-top: 3px;
              }
              
              .notes {
                margin: 6px 0;
                border-top: 1px dashed #000;
                padding-top: 3px;
                font-size: 9px;
                text-align: center;
                word-break: break-word;
              }
              
              .notes strong {
                display: block;
                margin-bottom: 2px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${a.shop_name}</h2>
              <p>P.O. Box: ${a.shop_po_box||"N/A"}</p>
              <p>${a.shop_address||"N/A"}</p>
              <p>Phone: ${a.shop_phone_number||"N/A"}</p>
              <p>KRA PIN: ${a.shop_kra_pin||"N/A"}</p>
            </div>
            
            <div class="info-row">
              <span class="info-label">Invoice:</span>
              <span class="info-value">${a.invoice_number}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${q(a.created_at)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Customer:</span>
              <span class="info-value">${a.customer_name}</span>
            </div>
            ${a.customer_phone?`<div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${a.customer_phone}</span>
            </div>`:""}
            <div class="info-row">
              <span class="info-label">Cashier:</span>
              <span class="info-value">${a.created_by_name}</span>
            </div>
            
            <div class="items-section">
              <div class="items-header">ITEMS</div>
              ${a.items.map(a=>`
                <div class="item">
                  <div class="item-name">${a.product_name}</div>
                  <div class="item-details">${a.quantity} \xd7 ${parseFloat(a.unit_price).toFixed(2)} = ${parseFloat(a.total_price).toFixed(2)}</div>
                </div>
              `).join("")}
            </div>
            
            <div class="summary-section">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>${parseFloat(a.subtotal).toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Tax:</span>
                <span>${parseFloat(a.tax_amount).toFixed(2)}</span>
              </div>
              ${parseFloat(a.discount_amount)>0?`<div class="summary-row">
                <span>Discount:</span>
                <span>-${parseFloat(a.discount_amount).toFixed(2)}</span>
              </div>`:""}
            </div>
            
            <div class="total-row">
              <span>TOTAL:</span>
              <span>KSh ${parseFloat(a.total_amount).toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span>Paid:</span>
              <span>KSh ${parseFloat(a.amount_paid).toFixed(2)}</span>
            </div>
            ${parseFloat(a.change_amount)>0?`<div class="summary-row">
              <span>Change:</span>
              <span>KSh ${parseFloat(a.change_amount).toFixed(2)}</span>
            </div>`:""}
            
            <div class="payment-info">
              <div class="summary-row">
                <span>Payment Method:</span>
                <span>${a.payment_method_display}</span>
              </div>
              <div class="summary-row">
                <span>Status:</span>
                <span>${a.status_display}</span>
              </div>
            </div>
            
            ${a.notes?`<div class="notes">
              <strong>Notes:</strong>
              <div>${a.notes}</div>
            </div>`:""}
            
            <div class="footer">
              <div style="font-weight: bold; margin-bottom: 3px; font-size: 10px;">Thank You for Shopping with Us!</div>
            </div>
          </body>
        </html>
      `),b.document.close(),b.onload=function(){b.print(),b.close()},setTimeout(()=>{b.print(),b.close()},500))},children:(0,d.jsx)(l.A,{className:"h-4 w-4"})}),(0,d.jsx)(g.$,{size:"sm",variant:"outline",onClick:b,children:(0,d.jsx)(m.A,{className:"h-4 w-4"})})]})]}),(0,d.jsx)(f.Wu,{className:"overflow-y-auto max-h-[calc(90vh-120px)]",children:(0,d.jsxs)("div",{className:"bg-white border-2 border-gray-300 rounded-lg p-4 font-mono text-sm",children:[(0,d.jsxs)("div",{className:"text-center mb-4",children:[(0,d.jsx)("div",{className:"text-lg font-bold",children:a.shop_name}),(0,d.jsxs)("div",{className:"text-xs text-gray-600",children:["P.O. Box: ",a.shop_po_box||"N/A"]}),(0,d.jsx)("div",{className:"text-xs text-gray-600",children:a.shop_address||"N/A"}),(0,d.jsxs)("div",{className:"text-xs text-gray-600",children:["Phone: ",a.shop_phone_number||"N/A"]}),(0,d.jsxs)("div",{className:"text-xs text-gray-600",children:["KRA PIN: ",a.shop_kra_pin||"N/A"]})]}),(0,d.jsxs)("div",{className:"space-y-2 mb-4",children:[(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Invoice:"}),(0,d.jsx)("span",{className:"font-bold",children:a.invoice_number})]}),(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Date:"}),(0,d.jsx)("span",{children:q(a.created_at)})]}),(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Customer:"}),(0,d.jsx)("span",{children:a.customer_name})]}),a.customer_phone&&(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Phone:"}),(0,d.jsx)("span",{children:a.customer_phone})]}),(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Cashier:"}),(0,d.jsx)("span",{children:a.created_by_name})]})]}),(0,d.jsxs)("div",{className:"border-t border-b border-gray-300 py-2 mb-4",children:[(0,d.jsx)("div",{className:"text-center font-bold mb-2",children:"ITEMS"}),a.items.map((a,b)=>(0,d.jsxs)("div",{className:"mb-2",children:[(0,d.jsx)("div",{className:"font-medium",children:a.product_name}),(0,d.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,d.jsxs)("span",{children:[a.quantity," \xd7 ",parseFloat(a.unit_price).toFixed(2)]}),(0,d.jsx)("span",{className:"font-bold",children:parseFloat(a.total_price).toFixed(2)})]})]},a.id))]}),(0,d.jsxs)("div",{className:"space-y-1 mb-4",children:[(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Subtotal:"}),(0,d.jsx)("span",{children:parseFloat(a.subtotal).toFixed(2)})]}),(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Tax:"}),(0,d.jsx)("span",{children:parseFloat(a.tax_amount).toFixed(2)})]}),parseFloat(a.discount_amount)>0&&(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Discount:"}),(0,d.jsxs)("span",{children:["-",parseFloat(a.discount_amount).toFixed(2)]})]})]}),(0,d.jsxs)("div",{className:"border-t-2 border-gray-300 pt-2 mb-4",children:[(0,d.jsxs)("div",{className:"flex justify-between text-lg font-bold",children:[(0,d.jsx)("span",{children:"TOTAL:"}),(0,d.jsxs)("span",{children:["KSh ",parseFloat(a.total_amount).toFixed(2)]})]}),(0,d.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,d.jsx)("span",{children:"Paid:"}),(0,d.jsxs)("span",{children:["KSh ",parseFloat(a.amount_paid).toFixed(2)]})]}),parseFloat(a.change_amount)>0&&(0,d.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,d.jsx)("span",{children:"Change:"}),(0,d.jsxs)("span",{children:["KSh ",parseFloat(a.change_amount).toFixed(2)]})]})]}),(0,d.jsxs)("div",{className:"space-y-1 mb-4 text-sm",children:[(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Payment Method:"}),(0,d.jsx)("span",{children:a.payment_method_display})]}),(0,d.jsxs)("div",{className:"flex justify-between",children:[(0,d.jsx)("span",{children:"Status:"}),(0,d.jsx)(h.E,{variant:"outline",className:"text-xs",children:a.status_display})]})]}),a.notes&&(0,d.jsx)("div",{className:"border-t border-gray-300 pt-2 mb-4",children:(0,d.jsxs)("div",{className:"text-sm",children:[(0,d.jsx)("div",{className:"font-medium mb-1",children:"Notes:"}),(0,d.jsx)("div",{className:"text-gray-600",children:a.notes})]})}),(0,d.jsx)("div",{className:"text-center text-sm",children:(0,d.jsx)("div",{className:"text-gray-600",children:"Please keep this receipt for your records"})})]})})]})})}},10022:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("file-text",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},13964:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]])},23928:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]])},31158:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]])},32979:(a,b,c)=>{c.d(b,{Aq:()=>n,Cb:()=>l,de:()=>m,my:()=>k,sV:()=>j}),c(36784);var d=c(96718);let e="https://supa.sirnkunja.co.ke/api/invoices/",f=async a=>{try{let b=new URLSearchParams;a?.page&&b.append("page",a.page),a?.search&&b.append("search",a.search),a?.status&&b.append("status",a.status),a?.date_from&&b.append("date_from",a.date_from),a?.date_to&&b.append("date_to",a.date_to),a?.shop&&b.append("shop",a.shop);let c=b.toString()?`${e}?${b.toString()}`:e;return(await d.default.get(c)).data}catch(a){throw Error("Failed to fetch invoices.")}},g=async a=>{try{return(await d.default.post(e,a)).data}catch(a){throw Error("Failed to create invoice.")}};var h=c(64312),i=c(52208);let j=async(a="30")=>{try{return await (0,i.t)(a)}catch(a){throw Error("Failed to fetch sales statistics.")}},k=async(a=10,b=!1)=>{try{console.log("\uD83D\uDD04 Fetching recent invoices from API");let b=await f({page:"1"});return Array.isArray(b?.results)&&b.results.length&&(b.results=b.results.slice(0,a)),b}catch(a){throw Error("Failed to fetch recent invoices.")}},l=async(a=!1)=>{try{console.log("\uD83D\uDD04 Fetching fresh invoices from API");let a=await f({});return Array.isArray(a?.results)&&a.results.length&&(a.results=a.results.slice(0,a.count)),a}catch(a){throw Error("Failed to fetch all invoices.")}},m=async a=>{try{return await (0,h.ZK)({search:a})}catch(a){throw Error("Failed to fetch products for sale.")}},n=async a=>{try{return await g(a)}catch(a){throw Error("Failed to create sales invoice.")}}},52208:(a,b,c)=>{c.d(b,{t:()=>e}),c(36784);var d=c(96718);let e=async(a="30",b=!1)=>{try{return console.log(`🔄 Fetching sales summary from API for ${a} days`),(await d.default.get(`https://supa.sirnkunja.co.ke/api/invoices/sales_summary/?period_days=30?period_days=${a}`)).data}catch(a){throw Error("Failed to fetch sales summary.")}}},58869:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("user",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},70615:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},71444:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]])},78122:(a,b,c)=>{c.d(b,{A:()=>d});let d=(0,c(62688).A)("refresh-cw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]])}};