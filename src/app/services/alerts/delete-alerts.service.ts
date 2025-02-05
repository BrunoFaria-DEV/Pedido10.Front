import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DeleteAlertsService {

  constructor() { }

  async delete(name: string): Promise<boolean> {
    const result = await Swal.fire({
      title: name != null ? `Deseja Excluir esse ${name}?` : 'Deseja Excluir esse Item?',
      text: name != null ? `O ${name} será excluido permanentemente do sistema!` : 'O Item será excluido permanentemente do sistema!',
      icon: 'warning',
      confirmButtonText: 'Ok',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      Swal.fire("O Produto foi excluido com sucesso!", "", "success");
      return true;
    }
    return false;
  }

  async deleteCustom(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
                    title: title ?? 'Deseja Excluir esse Produto?',
                    text: text ?? 'O Item será excluido permanentemente do sistema!',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar'
                  });

    if (result.isConfirmed) {
      await Swal.fire("O Produto foi excluido com sucesso!", "", "success");
        return true;
    }

    return false;    
  }
}