import Executer from "./modules/Executer";
import Painter from "./modules/Painter";
import Point from "./modules/Point";
import Preset from "./modules/Preset";

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

   const mapPresets = new Map<number, Preset>([
      [1, new Preset(1, 2)],
      [2, new Preset(0, 1)],
      [3, new Preset(-20, 50)],
      //[4, new Preset(1, 2)]
   ]);

   const form: HTMLFormElement = document.querySelector('.form')!;

   const xMaxError = form.querySelector('.form__error-block_x-max') as HTMLElement;
   const tayError = form.querySelector('.form__error-block_tay') as HTMLElement;

   const hideError = () => {
      xMaxError.hidden = true;
      tayError.hidden = true;
   }

   const initSelect = () => {
      interface IOption{
         value: number | string; 
         text: number | string;
      }
      const getOptionHtml = ({text, value}: IOption) => `<div data-value="${value}" class="custom-select__option">${text}</div>` 
      const getCustomSelectHtml = (bodyHtml: string[], {text, value}: IOption) => {
         return `<div class="select__custom-select custom-select">
            <div data-value="${value}" class="custom-select__line">${text}</div>
            <div class="custom-select__wrapper">${bodyHtml.join('')}</div>
         </div>`;
      }

      const selectEl = document.querySelector('select') as HTMLSelectElement;
      selectEl.hidden = true;

      const optionList: HTMLOptionElement[] = Array.from(selectEl.options);
      const {bodyHtml, selected} = optionList.reduce((result: {'bodyHtml': string[], 'selected': IOption }, option: HTMLOptionElement) => {

         const optionData: IOption = {'text': option.textContent!, 'value': option.value} ;

         result.bodyHtml.push(getOptionHtml(optionData));

         if(option.selected)
            result.selected = optionData;

         return result;
      }, {'bodyHtml': [], 'selected': {'text': optionList[0].textContent!, 'value': optionList[0].value}});

      const customSelectHTML = getCustomSelectHtml(bodyHtml, selected);
      selectEl.parentElement?.insertAdjacentHTML('beforeend', customSelectHTML);

      const customSelectEl = selectEl.parentElement?.lastElementChild! as HTMLElement;
      const customSelectLine = customSelectEl.firstElementChild! as HTMLElement;

      const preset = mapPresets.get(+selectEl.value!);
      (form.elements.namedItem('x_0') as HTMLInputElement).value = preset!.X_0.toString();
      (form.elements.namedItem('y_0') as HTMLInputElement).value = preset!.Y_0.toString();

      customSelectEl.addEventListener('click', e => {
         const el = e.target as HTMLElement;

         if(el.closest('.custom-select__option')){
            const customOption = el.closest('.custom-select__option') as HTMLElement;

            const value = customOption.dataset.value;
            const text = customOption.textContent!;

            selectEl.value = value!;
            //console.log(selectEl.value);

            customSelectLine.dataset.value = value;
            customSelectLine.textContent = text;

            const preset = mapPresets.get(+value!);

            (form.elements.namedItem('x_0') as HTMLInputElement).value = preset!.X_0.toString();
            (form.elements.namedItem('y_0') as HTMLInputElement).value = preset!.Y_0.toString();

            if(customSelectEl.classList.contains('_active'))
               hideError();

            customSelectEl.classList.remove('_active');
         }else if(el.closest('.custom-select__line')){
            customSelectEl.classList.toggle('_active');
         }
      });
   }

   initSelect();

   document.addEventListener('click', e => {
      const el = e.target as HTMLElement;

      if(!el.closest('.custom-select._active')){
         document.querySelector('.custom-select')?.classList.remove('_active');
      }
   });

   let painter: Painter;
   let pointList: Point[] | null = null;

   const canvasWrapper = document.querySelector('.content__wrapper') as HTMLElement;
   const canvas = canvasWrapper.firstElementChild as HTMLCanvasElement;

   const reset = () => {
      canvas.onmousemove = null;
      (document.querySelector('.display') as HTMLElement).style.visibility = 'hidden';
   }

   const initCanvas = () => {
      const resireHandler = () => {
         const width = canvasWrapper.parentElement!.offsetWidth;

         canvas.width = width;

         if(document.body.classList.contains('submited'))
            canvas.height = width;

         if(pointList){
            reset();

            console.log('!!!!!!!!!!!!!!!!!');
            painter = new Painter(pointList, canvas, +(form.elements.namedItem('xMax') as HTMLInputElement).value, window.innerWidth);
            painter.Start();
         }
        // console.log(canvasWrapper.offsetWidth);
      };

      //resireHandler();
      //window.addEventListener('resize', () => setTimeout(resireHandler, 100));
      window.onresize = resireHandler;
   }

   initCanvas();

   // const form: HTMLFormElement = document.querySelector('.form')!;

   const xMaxInput = form.elements.namedItem('xMax') as HTMLInputElement;
   const tayInput = form.elements.namedItem('tay') as HTMLInputElement;
   const xZeroInput = form.elements.namedItem('x_0') as HTMLInputElement;
   const yZeroInput = form.elements.namedItem('y_0') as HTMLInputElement;
   const seclectEl = document.querySelector('select') as HTMLSelectElement;

   [xMaxInput, tayInput].forEach(input => input.addEventListener('input', e => {
      const el = e.target as HTMLInputElement;

      (el.nextElementSibling as HTMLElement).hidden = true;
   }));

   xMaxError.hidden = true;
   tayError.hidden = true;

   xMaxInput.focus();

   form.addEventListener('submit', e => {
      e.preventDefault();

      document.body.classList.add('submited');

      const xMaxInputValue: number = +xMaxInput.value;
      const tayInputValue: number = +tayInput.value;
      const xZeroInputValue: number = +xZeroInput.value;
      const yZeroInputValue: number = +yZeroInput.value;
      const selectValue: number = +seclectEl.value;

      if(xMaxInputValue <= xZeroInputValue){
         //console.log('XMax слишкол маленькое');

         xMaxError.hidden = false;
         xMaxError.textContent = 'XMax слишкол маленькое';

         return;
      }else if(xMaxInputValue > 1200){
         console.log('XMax слишком большое');

         xMaxError.hidden = false;
         xMaxError.textContent = 'XMax слишком большое';

         return;
      }else if(tayInputValue > 0 && tayInputValue < 0.001){
         console.log('Tay слишком маленькое');

         tayError.hidden = false;
         tayError.textContent = 'Tay слишком маленькое';

         return;
      }else if(tayInputValue <= 0){
         console.log('Недопустимое значение Tay');

         tayError.hidden = false;
         tayError.textContent = 'Недопустимое значение Tay';

         return;
      }

      //console.log(xMaxInputValue, tayInputValue, xZeroInputValue, yZeroInputValue);

      const executer = new Executer(tayInputValue, xMaxInputValue, xZeroInputValue, yZeroInputValue, selectValue);
      executer.Start();

      //initCanvas();

      reset();

      pointList = executer.PointList;

      window.dispatchEvent(new Event('resize'));
      
      // setTimeout(() => {
      //    painter = new Painter(pointList!, canvas, xMaxInputValue, window.innerWidth);
      //    painter.Start();
      // }, 10);
      // painter = new Painter(pointList, canvas, xMaxInputValue, window.innerWidth);
      // painter.Start();
   });
}