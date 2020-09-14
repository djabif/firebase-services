import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { forkJoin, Observable } from 'rxjs';
import { CategoryModel } from './models/category.model';
import { ProductModel } from './models/product.model';
import { first, map } from 'rxjs/operators';
import { TagModel } from './models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public firestore: AngularFirestore) { }

  getProducts(): Observable<ProductModel[]> {
    return this.firestore.collection<ProductModel>('products').snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const product = a.payload.doc.data();
        const id = a.payload.doc.id;
        const category$ = this.getCategory(product.categoryId);
        const tags$ = forkJoin(product.tagsIds?.map(tagId => this.getTag(tagId).pipe(first())));
        return { id, category$, tags$, ...product } as ProductModel;
      }))
    );
  }

  getCategory(categoryId: string): Observable<CategoryModel> {
    return this.firestore.doc<CategoryModel>('categories/' + categoryId)
    .snapshotChanges()
    .pipe(
      map(a => {
        const data = a.payload.data();
        const id = a.payload.id;
        return { id, ...data } as CategoryModel;
      })
    );
  }

  getTag(tagId: string): Observable<TagModel> {
    return this.firestore.doc<TagModel>('tags/' + tagId)
    .snapshotChanges()
    .pipe(
      map(a => {
        const data = a.payload.data();
        const id = a.payload.id;
        return { id, ...data } as TagModel;
      })
    );
  }

  insertProduct(product: ProductModel) {
    this.firestore.collection('products').add(Object.assign({}, product))
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }

  deleteProduct(productId: string) {
    this.firestore.collection('products').doc(productId).delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  updateProduct(productModel: ProductModel) {
    const {category$, tags$, ...product} = productModel;
    this.firestore.collection('products').doc(product.id).set(product)
    .then(function() {
      console.log("Document successfully updated!");
    }).catch(function(error) {
      console.error("Error updating document: ", error);
    });
  }
}
