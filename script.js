const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
const exportBtn = document.getElementById('exportBtn');

inputs.forEach(input => input.addEventListener('change', update));
if (exportBtn) exportBtn.addEventListener('click', exportToXlsx);

function sumChecked(name) {
  const boxes = Array.from(document.querySelectorAll(`input[name="${name}"][type="checkbox"]`));
  const checked = boxes.filter(box => box.checked);

  const none = checked.find(box => box.dataset.none === "true");
  if (none) {
    boxes.forEach(box => {
      if (box !== none) box.checked = false;
    });
    return 0;
  }

  const noneBox = boxes.find(box => box.dataset.none === "true");
  if (noneBox) noneBox.checked = false;

  return checked.reduce((sum, box) => sum + Number(box.value || 0), 0);
}

function getValue(name) {
  const anyCheckbox = document.querySelector(`input[name="${name}"][type="checkbox"]`);
  if (anyCheckbox) return sumChecked(name);

  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? Number(selected.value) : 0;
}

function getSelectedText(name) {
  const anyCheckbox = document.querySelector(`input[name="${name}"][type="checkbox"]`);

  if (anyCheckbox) {
    const boxes = Array.from(document.querySelectorAll(`input[name="${name}"][type="checkbox"]`));
    const checked = boxes.filter(box => box.checked);

    if (checked.length === 0) return 'Not selected';
    if (checked.some(box => box.dataset.none === "true")) return 'Not required (0)';

    return checked
      .map(box => (box.closest('tr')?.children?.[0]?.textContent || '').trim())
      .filter(Boolean)
      .join(' + ');
  }

  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected
    ? (selected.closest('tr')?.children?.[0]?.textContent || 'Selected').trim()
    : 'Not selected';
}

function update() {
  const categoryNames = [
    'sb-p',
    'or-p',
    'mx-p',
    'sk-p',
    'ef-p',
    'ec-p',
    'rf-p',
    'ff-p',
    'nd-p'
  ];

  let proposedTotal = 0;

  categoryNames.forEach(name => {
    proposedTotal += getValue(name);
  });

  document.getElementById('totalProposed').textContent = proposedTotal;
}

function exportToXlsx() {
  if (typeof XLSX === 'undefined') {
    alert('XLSX export library failed to load. Check the SheetJS script tag in index.html.');
    return;
  }

  const aoa = [];
  aoa.push(['Group Heading', 'Section', 'Selected Option', 'Score']);

  const sections = [
    { group: 'Structures Resected', section: 'Skull Base', name: 'sb-p' },
    { group: 'Structures Resected', section: 'Orbit', name: 'or-p' },
    { group: 'Structures Resected', section: 'Maxilla', name: 'mx-p' },
    { group: 'Structures Resected', section: 'Skin resection', name: 'sk-p' },
    { group: 'Exposure', section: 'Facial', name: 'ef-p' },
    { group: 'Exposure', section: 'Cranial', name: 'ec-p' },
    { group: 'Reconstruction', section: 'Regional flap', name: 'rf-p' },
    { group: 'Reconstruction', section: 'Free flap', name: 'ff-p' },
    { group: 'Lymph Node Basin Management', section: 'Neck dissection', name: 'nd-p' }
  ];

  sections.forEach(item => {
    aoa.push([
      item.group,
      item.section,
      getSelectedText(item.name),
      getValue(item.name)
    ]);
  });

  aoa.push([]);
  aoa.push([
    'TOTAL',
    '',
    '',
    Number(document.getElementById('totalProposed').textContent || 0)
  ]);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  ws['!cols'] = [
    { wch: 28 },
    { wch: 22 },
    { wch: 42 },
    { wch: 10 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'RAS-SNC');

  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    '_',
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0')
  ].join('');

  XLSX.writeFile(wb, `RAS-SNC_${stamp}.xlsx`);
}

update();
