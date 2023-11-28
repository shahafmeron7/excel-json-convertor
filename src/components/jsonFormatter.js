import React, { useState } from 'react';
import ExcelJS from 'exceljs';
import saveAs  from 'file-saver';

function JsonFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const jsonText = event.target.value;
    setInputJson(jsonText);
    setError(null);
  };

  const transformJsonToNewStructure = (jsonData) => {
    try {
      const parsedJson = JSON.parse(jsonData);
      // Implement the transformation logic here
      if (parsedJson.rows) {
        const transformedRows = parsedJson.rows.map(row => {
          const [country, device, header, url] = row.keys;
          return {
            country,
            device,
            header,
            url,
            clicks: row.clicks,
            impressions: row.impressions,
            ctr: row.ctr,
            position: row.position,
          };
        });
        return { rows: transformedRows };
      } 
    } catch (e) {
      setError('Invalid JSON');
      return null;
    }
  };

  const handleTransformClick = () => {
    const transformedData = transformJsonToNewStructure(inputJson);
    exportToCSV(transformedData);
  };

  async function exportToCSV(transformedData) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('My Sheet');
    
    worksheet.columns = Object.keys(transformedData.rows[0]).map(key=>{
        return {header: key, width:25}
    })
    transformedData.rows.map(row=>worksheet.addRow(Object.values(row)))
    workbook.xlsx.writeBuffer().then((buf) => {
        const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, 'worksheet.xlsx');
        return true;
    });

}

  return (
    <div>
      <h2>JSON Formatter</h2>
      <div>
        <textarea
          placeholder="Enter JSON here..."
          value={inputJson}
          onChange={handleInputChange}
          rows={10}
          cols={150}
        />
      </div>
      <button onClick={handleTransformClick}>Export</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default JsonFormatter;
