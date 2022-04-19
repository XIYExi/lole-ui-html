const buttons = document.querySelectorAll('.my-button-text');
const floatingButton = document.querySelector('.floating-button');
buttons.forEach(button =>{
    button.addEventListener('click',()=>{
        let myEvent = button.dataset.command;
        if(myEvent === 'insertImage' || myEvent === 'createLink')
        {
            let url = prompt('Insert link here');
            document.execCommand(myEvent,false,url);
        }
        else if(myEvent === 'formatBlock')
        {
            let formattingValue = button.dataset.block;
            document.execCommand(myEvent,false,formattingValue);
        }
        else{
            document.execCommand(myEvent,false,null);
        }
    })
})

floatingButton.addEventListener('click',()=>{
    //alert("you clicked on fullscreen");
    let myHeading = document.querySelector('.title');
    let textEditorMain = document.querySelector('.text-editor-main');
    let contentOutput = document.querySelector('.contentOutput');
    contentOutput.classList.toggle('fullscreen-output');
    textEditorMain.classList.toggle('fullscreen-text-editor');
    myHeading.classList.toggle('fullscreen-title');
    if(contentOutput.classList.contains('fullscreen-output'))
    {
        floatingButton.childNodes[0].classList.remove('fa-expand-arrows-alt');
        floatingButton.childNodes[0].classList.add('fa-compress-arrows-alt');
    }
    else
    {
        floatingButton.childNodes[0].classList.remove('fa-compress-arrows-alt');
        floatingButton.childNodes[0].classList.add('fa-expand-arrows-alt');
    }
})