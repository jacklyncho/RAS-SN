const inputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');

inputs.forEach(input => {
  input.addEventListener('change', update);
});

function sumChecked(name) {
  const boxes = Array.from(
    document.querySelectorAll(`input[name="${name}"][type="checkbox"]`)
  );

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
  const checkbox = document.querySelector(`input[name="${name}"][type="checkbox"]`);
  if (checkbox) return sumChecked(name);

  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? Number(selected.value) : 0;
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

  let total = 0;

  categoryNames.forEach(name => {
    total += getValue(name);
  });

  document.getElementById('totalProposed').textContent = total;
}

update();
