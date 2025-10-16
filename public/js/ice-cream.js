document.getElementById('ice-cream-order-form').onsubmit = () => {
    let isValid = true;

    let fname = document.getElementById("fname").value.trim();
    let email = document.getElementById("email").value.trim();

    if(!fname){
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }
    if(!email || email.indexOf("@") === -1){
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    let methodButton = document.getElementsByName("method");
    let count = 0;
    for(let i=0; i<methodButton.length; i++){
        if(methodButton[i].checked){
            count++
        }
    }
    if(count === 0){
        document.getElementById("err-method").style.display = "block"
        isValid=false;
    }

    let flavor = document.getElementById("icecreamflavor").value;
    if(flavor === "none"){
        document.getElementById("err-flavor").style.display = "block";
        isValid = false;
    }

    return isValid
}