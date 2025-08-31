import React, { ChangeEvent,useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

const ReportComponent = () => {
   const [base64Data,setBase64Data] = useState("");

   function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
      if(!event.target.files) return;
      const file = event.target.files[0];
      if(file){
         let isValidImg = false;
         let isValidDoc = false;

         const validImages = ['image/jpeg','image/jpg','image/png','image/webp'];
         const validDocs = ['application/pdf'];

         if(validImages.includes(file.type)){
            isValidImg = true;
         }
         if(validDocs.includes(file.type)){
            isValidDoc = true;
         }    
         
         if(!(isValidDoc || isValidImg)){
            toast.error("Filetype not supported");
            return;
         }

         if(isValidDoc){
            const reader = new FileReader();
            reader.onloadend = () => {
               const fileContent = reader.result as string;
               console.log(fileContent);
               setBase64Data(fileContent);
            }

            reader.readAsDataURL(file);
         }

         if(isValidImg){
            compressImage(file,(compressedFile: File)=>{
               const reader = new FileReader();
               reader.onloadend = () => {
                  const fileContent = reader.result as string;
                  console.log(fileContent);
                  setBase64Data(fileContent);
               }
   
               reader.readAsDataURL(compressedFile);
            })
         }
      }
   }

   function extractDetails(): void {
      throw new Error('Function not implemented.');
   }

  return (
    <div className='grid w-full items-start gap-6 overflow-auto p-4 pt-0'>
       <fieldset className='relative grid gap-6 rounded-lg border p-4'>
       <legend className="text-sm font-medium">Doc</legend>
       <Input 
       accept=".jpg,.jpeg,.png,webp,.pdf"
       type='file' 
       onChange={handleReportSelection}
       />
       <Button onClick={extractDetails}>1. Upload File</Button>
       <Label>Doc Summary</Label>
         <Textarea
             placeholder="Extracted data from the contract/agreement will appear here. Get better recommendations by providing additional information..."
             className="min-h-72 resize-none border-0 p-3 shadow-none focus-visible:ring-0" />  
         <Button variant={'destructive'} className='bg-[#D90013]'>2. Looks Good</Button>         
       </fieldset>
    </div>
  )
}

export default ReportComponent;

function compressImage(file: File, callback: (compressedFile: File) => void) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Create a canvas element
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set  canvas dimensions to match the image
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image onto the canvas
                ctx!.drawImage(img, 0, 0);


                // Apply basic compression (adjust quality as needed)
                const quality = 0.1; // Adjust quality as needed

                // Convert canvas to data URL
                const dataURL = canvas.toDataURL('image/jpeg', quality);

                // Convert data URL back to Blob
                const byteString = atob(dataURL.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);

                }
                const compressedFile = new File([ab], file.name, { type: 'image/jpeg' });

                callback(compressedFile);
            };
            img.src = e.target!.result as string;
        };

        reader.readAsDataURL(file);
    }
