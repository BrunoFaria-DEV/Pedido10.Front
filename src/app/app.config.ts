import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withInterceptors, provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { tokenInterceptor } from './services/interceptors/token.interceptor';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { checkBannedInterceptor } from './services/interceptors/checkBanned.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideEnvironmentNgxMask(),
    provideHttpClient(withInterceptors([tokenInterceptor, checkBannedInterceptor])),
  ],
};