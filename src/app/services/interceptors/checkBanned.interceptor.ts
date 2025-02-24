import { HttpInterceptorFn } from "@angular/common/http";
import { AuthHelperServiceService } from "../helpers/auth-helper-service.service";
import { inject } from "@angular/core";
import { AuthUserService } from "../auth-user.service";


export const checkBannedInterceptor: HttpInterceptorFn = (request, next) => {
    const authHelperServiceService = inject(AuthHelperServiceService);
    const authUserService = inject(AuthUserService);

    if ( authUserService.logado == true) {
        console.log("logado")
        if ( authUserService.obterStatusUsuarioLogado == "D" ) {
            console.log("usuario status D:", authUserService.obterStatusUsuarioLogado)
            return next(request);
        }
        else {
            authHelperServiceService.deslogar();
        }
    }
    return next(request);
}