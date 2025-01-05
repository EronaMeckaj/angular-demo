export interface IDialogData<T = any> {
  formModel?: T;
  title?: string;
  editData?: T;
  showFormButtons?: boolean;
  message?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
}
