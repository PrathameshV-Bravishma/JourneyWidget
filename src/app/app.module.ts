import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { JourneyAuthComponent } from "./journey-auth/journey-auth.component";
import { HttpClientModule } from "@angular/common/http";

import { Injector } from "@angular/core";
import { createCustomElement } from "@angular/elements";

import { JourneyHttpService } from "./services/journey-http.service";
import { WebSocketService } from "./services/websocket.service";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { JourneyProfileComponent } from "./journey-profile/journey-profile.component";
import { NgbAccordionModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { NewJourneyProfileComponent } from "./new-journey-profile/new-journey-profile.component";
import { OptimizedCodeComponent } from "./optimized-code/optimized-code.component";
@NgModule({
  declarations: [
    AppComponent,
    JourneyAuthComponent,
    UserDetailsComponent,
    JourneyProfileComponent,
    NewJourneyProfileComponent,
    OptimizedCodeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FormsModule,
  ],
  providers: [JourneyHttpService, WebSocketService],
  bootstrap: [AppComponent],
  // entryComponents: [NewJourneyProfileComponent],
})
export class AppModule {
  // constructor(private injector: Injector) {
  //   const componentElement = createCustomElement(NewJourneyProfileComponent, {
  //     injector,
  //   });
  //   customElements.define("app-journey-auth", componentElement);
  // }
  // ngDoBootstrap() {}
}
