import Executer from "./modules/Executer";
import Painter from "./modules/Painter";

document.addEventListener('DOMContentLoaded', loadHandler);

function loadHandler(e: Event){

   (document.querySelector('.display') as HTMLElement).style.visibility = 'hidden';

   const initCheckbox = () => {

      const checkbox = document.querySelector('.checkbox')!;
      const checkboxEl: HTMLInputElement = checkbox.querySelector('input')!;

      checkbox.addEventListener('click', e => {
         checkboxEl.checked = !checkboxEl.checked;
         checkbox.classList.toggle('_active');
      });
   }

   const initSelect = () => {
      interface IOption{
         value: number | string; 
         text: number | string;
      }
      const getOptionHtml = ({text, value}: IOption) => `<div data-value="${value}" class="custom-select__option">${text}</div>` 
      const getCustomSelectHtml = (bodyHtml: IOption[], {text, value}: IOption) => {
         return `<div class="select__custom-select custom-select">
            <div data-value="${value}" class="custom-select__line">${text}</div>
            <div class="custom-select__wrapper">${bodyHtml.join('')}</div>
         </div>`;
      }

      const selectEl = document.querySelector('select') as HTMLSelectElement;
      selectEl.hidden = true;

      const optionList = Array.from(selectEl.options);



      console.log(optionList);
   }

   initSelect();

   const canvasWrapper = document.querySelector('.content__wrapper') as HTMLElement;
   const canvas = canvasWrapper.firstElementChild as HTMLCanvasElement;

   const initCanvas = () => {
      const resireHandler = () => {
         const width = canvasWrapper.parentElement!.offsetWidth;

         canvas.width = width;
         canvas.height = width;

         console.log(canvasWrapper.offsetWidth);
      };

      resireHandler();
      window.addEventListener('resize', () => setTimeout(resireHandler, 100));
   }

   const form: HTMLFormElement = document.querySelector('.form')!;

   const xMaxInput = form.elements.namedItem('xMax') as HTMLInputElement;
   const tayInput = form.elements.namedItem('tay') as HTMLInputElement;
   const xZeroInput = form.elements.namedItem('x_0') as HTMLInputElement;
   const yZeroInput = form.elements.namedItem('y_0') as HTMLInputElement;

   form.addEventListener('submit', e => {
      e.preventDefault();

      const xMaxInputValue: number = +xMaxInput.value;
      const tayInputValue: number = +tayInput.value;
      const xZeroInputValue: number = +xZeroInput.value;
      const yZeroInputValue: number = +yZeroInput.value;

      console.log(xMaxInputValue, tayInputValue, xZeroInputValue, yZeroInputValue);

      const executer = new Executer(tayInputValue, xMaxInputValue, xZeroInputValue, yZeroInputValue);
      executer.Start();

      initCanvas();
      canvas.onmousemove = null;
      (document.querySelector('.display') as HTMLElement).style.visibility = 'hidden';

      const painter = new Painter(executer.PointList, canvas);
      painter.Start();
   });
}