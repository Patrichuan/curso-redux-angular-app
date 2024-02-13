import { FormGroup } from "@angular/forms";

export function checkValidField(registroForm:FormGroup,  field: string): boolean {
  return registroForm.get(field)?.valid!!;
}
