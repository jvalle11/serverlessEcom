import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';

import { Product } from '../models/Product';
import { ProductListService } from '../services/product-list.service';
import { addProduct } from '../state/cart.actions';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  selectedProductId!: string;
  selectedQuantity: number = 1;
  variants: any[] = [{ node: { priceV2: { amount: 0 } } }];

  private stripeKey: string = environment.stripePublishableKey; // Access the publishable key

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductListService,
    private store: Store<{ cart: any[] }>,
    private http: HttpClient // Inject HttpClient to handle API calls
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    const handle = this.route.snapshot.paramMap.get('handle') || '';
    this.productsService.getProduct(handle).subscribe((product) => {
      this.product = product;
      this.selectedProductId = this.product.variants.edges[0].node.id;
      this.variants = product.variants.edges;
    });
  }

  addToCart(productInfo: any) {
    productInfo.cartId = window.localStorage.getItem('ngShopifyCartId') || '';
    this.store.dispatch(addProduct(productInfo));
    alert('Successfully added to cart 👍');
  }

  redirectToCheckout(productId: string): void {
    // Call your backend API to create a checkout session
    this.http
      .post('/api/create-checkout-session', { productIds: [productId] })
      .subscribe(
        (response: any) => {
          if (response?.url) {
            // Redirect the user to the Stripe checkout session URL
            window.location.href = response.url;
          } else {
            console.error('Failed to create checkout session', response);
          }
        },
        (error) => {
          console.error('Checkout error:', error);
        }
      );
  }
}
