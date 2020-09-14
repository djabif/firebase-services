import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { ProductModel } from './models/product.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  products$: Observable<ProductModel[]>;

  constructor(public firebaseService: FirebaseService) {
    this.products$ = firebaseService.getProducts();
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
}
