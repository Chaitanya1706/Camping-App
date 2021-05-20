const Images = document.querySelectorAll(".check-img")

for(let img of Images){
    img.addEventListener('click', (e)=>{
       
        if(e.target.nextElementSibling.checked){
            e.target.nextElementSibling.checked = false;
            img.style.border = "1px solid black"
        }
        else{
            e.target.nextElementSibling.checked = true;
            img.style.border = "4px solid black"
        }
    })
}