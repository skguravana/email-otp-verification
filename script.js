
const inputemailfield = document.querySelector('#email');
const email_error_text = document.querySelector('#email_error'); 
const submit_btn = document.querySelector('#submit');
const message_box = document.querySelector('#message_box');


const email_input_container = document.querySelector('.email-input')
const email_verify_container = document.querySelector('.email-verify')

email_input_container.style.display="block";
email_verify_container.style.display="none";

var otp_nums=document.querySelectorAll('.otp_num');

function verify_email(event){

    const regx = /^[a-zA-Z0-9_\.\-]+@[a-z]+\.[a-z]{2,3}$/;
    
    if(regx.test(inputemailfield.value)){
        email_error_text.innerHTML=" ";
        submit_btn.disabled=false;
        return true;
    }
    else{
        submit_btn.disabled=true;
        email_error_text.innerHTML="Enter Email Format";
        return false;
    }
}

inputemailfield.addEventListener('input',verify_email);
inputemailfield.addEventListener('blur',verify_email);

otp_nums.forEach((box,index)=>{
    box.addEventListener('keyup',movenext);
    box.addEventListener('keydown',moveback);
    box.addEventListener('paste',handlepaste);
});

function moveback(e){
    const current = e.target;
    const prevbox = current.previousElementSibling;
    
    if(e.keyCode===8){
        e.preventDefault();
        if(current.value.length===0){
            if(prevbox){
                prevbox.focus();
            }
        }
        else{
            current.value="";
        }
        
       
    }

}

function handlepaste(e){
    e.preventDefault();
    const pasteotp = e.clipboardData.getData('text');
    
    if(/^\d{4}$/.test(pasteotp)){
        otp_nums.forEach((box,index)=>{
            box.value = pasteotp[index];
        })
        otp_nums[3].focus();
    }
}

function movenext(e){
    const current = e.target;
    const nextbox = current.nextElementSibling;
    

    if(e.keyCode>=48 && e.keyCode<=57){
        if (current.value.length>1){
            current.value = e.keyCode-48;
            
        }
        if(nextbox){nextbox.focus();}
    }

    
}


document.querySelector('#submit').addEventListener('click',async (event)=>{
    event.preventDefault();
    
    if(verify_email()){
        submit_btn.disabled=true;
        inputemailfield.disabled=true;
        message_box.innerHTML="Sending...";
        var inputemail = inputemailfield.value;
        

        fetch('http://localhost:3000/sendotp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: inputemail })
          })
          .then(response => response.json())
          .then(data => {

                if(data.status == 'success'){
                    message_box.innerHTML= data.message;
                    message_box.style.color='green';
                    email_verify_container.style.display="block";
                    otp_nums[0].focus();

                }
                else if(data.status=='fail'){
                    message_box.innerHTML= data.message;
                    message_box.style.color='red';
                }

                else{
                    message_box.innerHTML=data.message;
                    message_box.style.color='red';
                }
                
          })
          .catch(error =>{
                message_box.innerHTML= "Unable to connect";
                message_box.style.color='red';
          })
      

          
    }


    
});

document.querySelector('#verify').addEventListener('click',async ()=>{
    let user_otp='';
    let inputemail = inputemailfield.value;
    otp_nums.forEach((box,indes)=>{
        user_otp+=box.value;
    })



    fetch('http://localhost:3000/verifyotp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputemail,otp:user_otp })
      })
      .then(response=>response.json())
      .then(data =>{
        if(data.status=='success'){
            alert(data.message);
            window.location.reload();
            
        }
        else{
            alert(data.message);
        }
      })
      .catch(error=>{
        alert("Errror");
      })
});


