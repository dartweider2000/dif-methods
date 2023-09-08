
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

   const xMaxInput = form.elements.namedItem('xMax') as HTMLInputElement;
   const printCheckbox = form.elements.namedItem('print') as HTMLInputElement;
   const tayInput = form.elements.namedItem('tay') as HTMLInputElement;
   const xZeroInput = form.elements.namedItem('x_0') as HTMLInputElement;
   const yZeroInput = form.elements.namedItem('y_0') as HTMLInputElement;

   // tMaxInput.focus();

   form.addEventListener('submit', e => {
      e.preventDefault();

      const xMaxInputValue: number = +xMaxInput.value;
      const tayInputValue: number = +tayInput.value;
      const xZeroInputValue: number = +xZeroInput.value;
      const yZeroInputValue: number = +yZeroInput.value;
      const printValue: boolean = printCheckbox.checked;

      console.log(xMaxInputValue, tayInputValue, xZeroInputValue, yZeroInputValue, printValue);
   });
}