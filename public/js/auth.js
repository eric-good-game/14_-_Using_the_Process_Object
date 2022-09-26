const form = document.querySelector('form');
const error = document.querySelector('.error');
const  keys = form.id == 'login' ? ['email', 'password'] : ['name', 'email', 'password'];
const redirect = form.id == 'login' ? '/' : '/auth/login';
const errors = []

const btnLoader = document.createElement('div');
btnLoader.classList.add('loader', 'loader1');
const btnLabel = document.createElement('p');
btnLabel.style.paddingBlock = '3px';
btnLabel.textContent = form.id==='login' ? 'Iniciar sesión' : 'Registrarse';

const btnSubmit = document.querySelector(`#btn-${form.id}`);
btnSubmit.innerHTML = btnLabel.outerHTML;

const validateEmail = (value) =>{
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(value);
}
keys.forEach(key => {
    const input = document.getElementById(key);

    input.addEventListener('blur', e => {
        const value = e.target.value.trim();
        if(!value){
            e.target.classList.add('error');
            errors.push(key);
            return
        }
        if(key == 'email' && !validateEmail(value)){
            e.target.classList.add('error');
            return
        }
        e.target.classList.remove('error');
    })
});

form.onsubmit = async e => {
    e.preventDefault();
    btnSubmit.innerHTML = btnLoader.outerHTML;
    const url = form.id == 'login' ? '/auth/login' : '/auth/signup';
    const formData = {};
    if(errors.length){
        error.innerHTML = 'Todos los campos son obligatorios.';
        error.classList.remove('hidden');
        btnSubmit.innerHTML = btnLabel.outerHTML;
        return
    }
    keys.forEach(key => {
        if(!form[key].value.trim()){
            error.textContent = `Todos los campos son necesarios.`;
            error.classList.remove('disable');
            return
        }
        formData[key] = form[key].value
    });
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await res;
        if(res.ok){
            location.href = '/';
        }else{
            const message = (await data.json()).message;

            error.innerHTML = message;
            error.classList.remove('hidden');
            btnSubmit.innerHTML = btnLabel.outerHTML;
        }
        
    } catch (err) {
        console.log(err);
    }
}