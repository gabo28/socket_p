const socket = io();

const formsadd = document.querySelectorAll('.needs-validation-add')
const formsfind = document.querySelectorAll('.needs-validation-find')
const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
const cuenta = document.getElementById('cuenta')
const saldo = document.getElementById('saldo')
const saldotext = document.getElementById('saldotext')
const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')
  alertPlaceholder.append(wrapper)
}




Array.from(formsadd).forEach(form => {
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    } else {
     
      socket.emit('client:sendData', {
        cuenta: cuenta.value,
        saldo: saldo.value
      })
      cuenta.disabled = true
      saldo.disabled = true
      event.preventDefault()
    }

    form.classList.add('was-validated')
  }, false)
})


Array.from(formsfind).forEach(form => {
  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.preventDefault()
      event.stopPropagation()
    } else {
      socket.emit('client:findData', {
        cuenta: document.getElementById('buscarCuenta').value,
      })
      event.preventDefault()
    }
    form.classList.add('was-validated')
  }, false)
})


socket.on('server:findData', (mensaje) =>{
  console.log(mensaje);
  if(!mensaje.error) saldotext.innerHTML = mensaje.data.saldo
  else saldotext.innerHTML = 'La cuenta no existe :('
})  

socket.on('server:sendData', (mensaje) =>{
  setTimeout(()=>{
    if (!mensaje.error)  alert(mensaje.mensaje, 'success')
    else  alert(mensaje.mensaje, 'error')
    cuenta.value = null
    saldo.value = null
    cuenta.disabled = false
    saldo.disabled = false
  }, 0)
  
})  


