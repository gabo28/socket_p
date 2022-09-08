const socket = io();

const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }else{
        socket.emit('client:sendData', {
            cuenta:'0000000',
            valor:'0000000'
        })
        event.preventDefault()
      }

      form.classList.add('was-validated')
    }, false)
  })


document.getElementById('bsatn').addEventListener('click', ()=>{
    console.log('okkk');
})


