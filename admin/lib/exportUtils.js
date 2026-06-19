export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    alert('No data to export');
    return;
  }

  // Get the headers
  const headers = Object.keys(data[0]);

  // Map the data to CSV rows
  const csvRows = data.map((row) =>
    headers
      .map((fieldName) => {
        let value = row[fieldName];
        if (value === null || value === undefined) value = '';
        value = String(value);
        // Escape quotes
        value = value.replace(/"/g, '""');
        // Wrap in quotes to handle commas
        return `"${value}"`;
      })
      .join(',')
  );

  // Add the header row
  csvRows.unshift(headers.join(','));

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
