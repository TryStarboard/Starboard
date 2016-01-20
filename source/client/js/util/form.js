export function collect(form) {
  const q = {};
  let i;
  let j;

  if (!form || form.nodeName !== 'FORM') {
    return null;
  }

  for (i = form.elements.length - 1; i >= 0; i--) {
    if (form.elements[i].name === '') {
      continue;
    }

    switch (form.elements[i].nodeName) {
    case 'INPUT':
      switch (form.elements[i].type) {
      case 'text':
      case 'email':
      case 'hidden':
      case 'password':
      case 'button':
      case 'reset':
      case 'submit':
        q[form.elements[i].name] = form.elements[i].value;
        break;
      case 'checkbox':
      case 'radio':
        if (form.elements[i].checked) {
          q[form.elements[i].name] = form.elements[i].value;
        }
        break;
      default:
        break;
      }
      break;
    case 'file':
      break;
    case 'TEXTAREA':
      q[form.elements[i].name] = form.elements[i].value;
      break;
    case 'SELECT':
      switch (form.elements[i].type) {
      case 'select-one':
        q[form.elements[i].name] = form.elements[i].value;
        break;
      case 'select-multiple':
        for (j = form.elements[i].options.length - 1; j >= 0; j--) {
          if (form.elements[i].options[j].selected) {
            if (q[form.elements[i].name]) {
              q[form.elements[i].name].push(form.elements[i].options[j].value);
            } else {
              q[form.elements[i].name] = [form.elements[i].options[j].value];
            }
          }
        }
        break;
      default:
        break;
      }
      break;
    case 'BUTTON':
      switch (form.elements[i].type) {
      case 'reset':
      case 'submit':
      case 'button':
        q[form.elements[i].name] = form.elements[i].value;
        break;
      default:
        break;
      }
      break;
    default:
      break;
    }
  }

  return q;
}

export function reset(form) {
  let i;
  let j;

  if (!form || form.nodeName !== 'FORM') {
    return null;
  }

  for (i = form.elements.length - 1; i >= 0; i--) {
    switch (form.elements[i].nodeName) {
    case 'INPUT':
      switch (form.elements[i].type) {
      case 'text':
      case 'email':
      case 'hidden':
      case 'password':
        form.elements[i].value = '';
        break;
      case 'checkbox':
      case 'radio':
        form.elements[i].checked = false;
        break;
      default:
        break;
      }
      break;
    case 'TEXTAREA':
      form.elements[i].value = '';
      break;
    case 'SELECT':
      switch (form.elements[i].type) {
      case 'select-one':
        form.elements[i].value = '';
        break;
      case 'select-multiple':
        for (j = form.elements[i].options.length - 1; j >= 0; j--) {
          form.elements[i].options[j].selected = false;
        }
        break;
      default:
        break;
      }
      break;
    default:
      break;
    }
  }
}
