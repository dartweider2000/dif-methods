
document.addEventListener('DOMContentLoaded', loadHandler);

function loadHandler(e: Event){
   
   const initCheckbox = () => {

      const checkbox = document.querySelector('.checkbox')!;
      const checkboxEl: HTMLInputElement = checkbox.querySelector('input')!;

      checkbox.addEventListener('click', e => {
         checkboxEl.checked = !checkboxEl.checked;
         checkbox.classList.toggle('_active');
      });
   }

   initCheckbox();

   const form: HTMLFormElement = document.querySelector('.form')!;

   const tMaxInput = form.elements.namedItem('tMax') as HTMLInputElement;
   const printCheckbox = form.elements.namedItem('print') as HTMLInputElement;

   // tMaxInput.focus();

   form.addEventListener('submit', e => {
      e.preventDefault();

      const tMaxInputValue: number = +tMaxInput.value;
      const printValue: boolean = printCheckbox.checked;
   });
}