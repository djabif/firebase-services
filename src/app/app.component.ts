import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { FirebaseService } from './firebase.service';
import { ProductModel } from './models/product.model';
import { UserModel } from './models/user.model';
// import { UserModel } from './models/user.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products$: Observable<ProductModel[]>;
  loggedUser: any;

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;

  constructor(
    public firebaseService: FirebaseService,
    public firebaseAuthenticationService: FirebaseAuthenticationService
  ) {
    this.products$ = firebaseService.getProducts();

    this.firebaseAuthenticationService.getLoggedUserObservable()
    .subscribe(user => {
      this.loggedUser = user;
    });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'test-file';

    const task = this.firebaseService.uploadFile(filePath, file);

    const fileRef = this.firebaseService.getFileRef(filePath);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          // this.downloadURL = fileRef.getDownloadURL();
          // save image to user
          this.downloadURL = fileRef.getDownloadURL().pipe(
            tap((imageUrl: string) => {
              let user = new UserModel();
              user.uid = this.firebaseAuthenticationService.getLoggedUser().uid;
              user.image = imageUrl;
              this.firebaseAuthenticationService.updateUser(user);
            })
          )

        })
     )
    .subscribe()
  }

  insertProduct() {
    let product = new ProductModel();
    product.name = "Black & White Sneakers";
    product.slug = "black-white-sneakers";
    product.featuredImage = "/assets/imgs/products/product-1.jpg";
    product.images = [
      "/assets/imgs/products/product-2.jpg",
      "/assets/imgs/products/product-3.jpg",
      "/assets/imgs/products/product-4.jpg"
    ];
    product.description = "Black Mamba is the finest shoe around, able to murder the crazy 88 by stepping where it hurts. Enjoy our free worldwide shipping today.";
    product.careDescription = "100% Viscose. Machine wash according to instructions on care label.";
    product.sku = "8726543D";
    product.price = 94;
    product.salePrice = 86;
    product.colors = ["black", "aquamarina", "white", "purple", "pink"];
    product.sizes = [7, 7.5, 8, 9, 9.5, 10];
    product.categoryId = "MpY1hIMdeWgf4775CNix";
    product.tagsIds = ["M1dd6cA1HgZ9eHCaMwUk", "6sDxQoWRQsqauZVBh3TP"];
    this.firebaseService.insertProduct(product);
  }

  deleteProduct(productId: string) {
    this.firebaseService.deleteProduct(productId);
  }

  updateProduct(product: ProductModel) {
    this.firebaseService.updateProduct(product);
  }

  signInWithEmail() {
    // this.resetSubmitError();
    this.firebaseAuthenticationService.signInWithEmail('dayanajabif@gmail.com', '123456')
    .then(result => {
      // navigate to user profile
      // debugger;
      this.firebaseAuthenticationService.saveUserData(result);
      // this.redirectLoggedUserToProfilePage();
    })
    .catch(error => {
          // debugger;
      // this.submitError = error.message;
      // this.dismissLoading();
    });
  }

  signUpWithEmail() {
    // this.resetSubmitError();
    this.firebaseAuthenticationService.signUpWithEmail('dayanajabif@gmail.com', '123456')
    .then(result => {
      // navigate to user profile
      // debugger;
      this.firebaseAuthenticationService.saveUserData(result);
      // this.redirectLoggedUserToProfilePage();
    })
    .catch(error => {
          // debugger;
      // this.submitError = error.message;
      // this.dismissLoading();
    });
  }

  doFacebookLogin(): void {
    // this.resetSubmitError();
    // this.prepareForAuthWithProvidersRedirection('facebook');

    this.firebaseAuthenticationService.signInWithFacebook()
    .subscribe((result) => {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const token = result.credential.accessToken;
      this.firebaseAuthenticationService.saveUserData(result);
      // this.redirectLoggedUserToProfilePage();
    }, (error) => {
      // this.manageAuthWithProvidersErrors(error.message);
    });
  }

  doGoogleLogin(): void {
    // this.resetSubmitError();
    // this.prepareForAuthWithProvidersRedirection('google');

    this.firebaseAuthenticationService.signInWithGoogle()
    .subscribe((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      this.firebaseAuthenticationService.saveUserData(result);
      // this.redirectLoggedUserToProfilePage();
    }, (error) => {
        console.log(error);
      // this.manageAuthWithProvidersErrors(error.message);
    });
  }

  doTwitterLogin(): void {
    // this.resetSubmitError();
    // this.prepareForAuthWithProvidersRedirection('twitter');

    this.firebaseAuthenticationService.signInWithTwitter()
    .subscribe((result) => {
      // This gives you a Twitter Access Token. You can use it to access the Twitter API.
      var token = result.credential.accessToken;
      this.firebaseAuthenticationService.saveUserData(result);
      // this.redirectLoggedUserToProfilePage();
    }, (error) => {
      console.log(error);
      // this.manageAuthWithProvidersErrors(error.message);
    });
  }

  signOut() {
    this.firebaseAuthenticationService.signOut();
  }

}
