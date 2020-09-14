import { Observable } from 'rxjs';
import { CategoryModel } from './category.model';
import { TagModel } from './tag.model';

export class ProductModel {
  id: string;
  name: string;
  featuredImage: string;
  images: string[];
  slug: string;
  price: number;
  salePrice: number;
  description: string;
  careDescription: string;
  sku: string;
  colors: string[];
  sizes: any[];
  categoryId: string;
  category$: Observable<CategoryModel>;
  tagsIds: string[];
  tags$: Observable<TagModel>[];
}
