import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { HttpService } from '../../shared-service/http.service';

export interface IBike {
  id?: number;
  image: string;
  price: number;
  quantity: number;
  description: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  bikes: Array<IBike> = [];
  myName = '';
  cars = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private http: HttpService
  ) { }

  async ngOnInit() {
    await this.refresh();
    // this.createCar('car', { make: 'Tesla', model: 'X'});
    // this.updateCar('car/id/1', { make: 'Ford', model: 'Festiva'});
  }

  async refresh() {
    this.cars = await this.getCars('car');
  }

  // getCars('car');
  async getCars(path: string) {
    const resp = await this.http.get(path);
    return resp;
  }

  async createCar() {
    const car = {
      make: null,
      model: null,
      year: null
    };
    const resp = await this.http.post("car", car);
    if (resp){
      // this.refresh();
      this.cars.unshift(resp);
    } else {
      this.toastService.showToast('danger', 3000, 'Car create failed!');
    }
    return resp;
  }

  async updateCar(car: any) {
    const resp = await this.http.put(`car/id/${car.id}`, car);
    if(resp){
      this.toastService.showToast('success', 3000, 'Car updated successfully!');
    }
    return resp;
  }

  async removeCar(car: any, index: number) {
    // this.cars.splice(index, 1);
    const resp = await this.http.delete(`car/id/${car.id}`);
    if (resp) {
      this.refresh();
    } else {
      this.toastService.showToast('danger', 3000, 'Delete car failed!');

    }
  }
}