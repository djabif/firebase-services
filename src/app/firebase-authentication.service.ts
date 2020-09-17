import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth, User } from 'firebase';
import { from, Observable, Subject } from 'rxjs';
import { UserModel } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  currentUser: User;
  private loggedUser$: Subject<any> = new Subject<any>();

  constructor(
    public angularFire: AngularFireAuth,
    public firestore: AngularFirestore
  ) {
    // Set an authentication state observer and get user data
    this.angularFire.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.currentUser = user;
        this.loggedUser$.next(user);
      } else {
        // No user is signed in.
        this.currentUser = null;
      }
    });
  }

  // Get the currently signed-in user
  getLoggedUser() {
    return this.currentUser;
  }

  getLoggedUserObservable() {
    return this.loggedUser$;
  }

  signOut(): Observable<any> {
    this.loggedUser$.next(null);
    return from(this.angularFire.signOut());
  }

  signInWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFire.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.angularFire.createUserWithEmailAndPassword(email, password);
  }

  socialSignIn(providerName: string, scopes?: Array<string>): Observable<any> {
    const provider = new auth.OAuthProvider(providerName);

    if (scopes) {
      scopes.forEach(scope => {
        provider.addScope(scope);
      });
    }
    return from(this.angularFire.signInWithPopup(provider));
  }

  signInWithFacebook() {
    const provider = new auth.FacebookAuthProvider();
    return this.socialSignIn(provider.providerId);
  }

  signInWithGoogle() {
    const provider = new auth.GoogleAuthProvider();
    const scopes = ['profile', 'email'];
    return this.socialSignIn(provider.providerId, scopes);
  }

  signInWithTwitter() {
    const provider = new auth.TwitterAuthProvider();
    return this.socialSignIn(provider.providerId);
  }

  saveUserData(signInResult: any) {
    const userInfo = signInResult.user;
    // const userCredentials = signInResult.credential;
    const additionalProfileInfo = signInResult.additionalUserInfo;

    // if new user then save it to Firestore
    if (additionalProfileInfo.isNewUser) {
      let user = new UserModel();
      user.uid = userInfo.uid;
      user.email = userInfo.email;
      user.image = this.getPhotoURL(additionalProfileInfo.providerId, userInfo.photoURL);
      user.name = userInfo.displayName;

      // Get a user's provider-specific profile information
      if (additionalProfileInfo.providerId === "twitter.com") {
        user.description = additionalProfileInfo.profile?.description;
        user.location = additionalProfileInfo.profile?.location;
        user.twUsername = additionalProfileInfo.profile?.screen_name;
      }
      if (additionalProfileInfo.providerId === "facebook.com") {

      }

      this.firestore.collection('users').doc(user.uid).set(Object.assign({}, user))
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
    }

  }

  getPhotoURL(signInProviderId: string, photoURL: string): string {
    // Default imgs are too small and our app needs a bigger image
    switch (signInProviderId) {
      case 'facebook.com':
        return photoURL + '?height=400';
      case 'password':
        return 'https://s3-us-west-2.amazonaws.com/ionicthemes/otros/avatar-placeholder.png';
      case 'twitter.com':
        return photoURL.replace('_normal', '_400x400');
      case 'google.com':
        return photoURL.split('=')[0];
      default:
        return photoURL;
    }
  }

  updateUser(user: UserModel) {
    this.firestore.collection('users').doc(user.uid).update(Object.assign({}, user))
    .then(function() {
      console.log("Document successfully updated!");
    })
    .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
    });
  }

  deleteUser(userId: string) {
    this.firestore.collection('users').doc(userId).delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

}
