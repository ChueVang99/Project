import { Component, OnInit } from '@angular/core';
import { Bracket } from './bracket.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';
import { HttpService } from '../../shared-service/http.service';
import { Http } from '@angular/http';
import { LocalStorageService } from '../localStorageService';
import { IUser } from '../login/login.component';



@Component({
  selector: 'bracket',
  templateUrl: './bracket.component.html',
  styleUrls: ['./bracket.component.css']
})
export class BracketComponent implements OnInit {

  teams = [];
  winners: string[] = [];
  value = '';
  tourneyName = '';
  tourneyTitle = '';
  disableSubmitButton = false;
  textDisabled = false;
  inText: string;
  bracketParams = '';
  localSorageSerive: LocalStorageService<Bracket>;
  currentUser: IUser;


  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) {
    this.localSorageSerive = new LocalStorageService('teams');
  }

  async ngOnInit() {
    const currentUser = this.localSorageSerive.getItemsFormLoacalStorage('user');
    if (currentUser == null) {
    }
    this.loadTeams();
    this.activatedRoute.params.subscribe((data: IUser) => {
      console.log('data passed from login component', data);
      this.currentUser = data;
    })
  }


  // navigateTo(path: string) {
  //   this.router.navigate([path]);
  // }

  async tourney() {
    this.tourneyTitle = this.tourneyName;
    this.disableSubmitButton = true;
    this.textDisabled = true;
    localStorage.setItem('Title', JSON.stringify(this.tourneyTitle));
  }
  
  async loadItemsFromFile() {
    const data = await this.http.get('assets/brackets.json').toPromise();
    return data.json();
  }

  async loadTeams() {
    this.tourneyTitle = JSON.parse(localStorage.getItem('Title'));
    const savedBrackets = this.getItemsFormLoacalStorage('teams');
    if (savedBrackets && savedBrackets.length > 0) {
      this.teams = savedBrackets;
    } else {
      this.teams = await this.loadItemsFromFile();
    }
  }

  clearAll() {
    this.teams = [];
    this.winners = [];
    this.tourneyTitle = null;
    localStorage.setItem('Title', JSON.stringify(this.tourneyTitle));
    this.localSorageSerive.saveItemsToLocalStorage(this.teams);
    // this.inText = '';
    // only clears textbox on the first click
  }

  addTeams(newTeam: string) {
    if (newTeam) {
      this.teams.push([newTeam]);
      console.log("newTeam is", this.teams);
      this.teams = newTeam.split(/[\r\n]+/, 8);
      console.log("team is ", this.teams);
      localStorage.setItem('teams', JSON.stringify(this.teams));

    }
  }

  getItemsFormLoacalStorage(key: string) {
    const savedBrackets = JSON.parse(localStorage.getItem(key));
    return this.localSorageSerive.getItemsFormLoacalStorage();
  }

  removeTeams(index: number) {
    this.teams.splice(index, 1);
    console.log("team is", this.teams);
    this.saveItemsToLocalStorge(this.teams);
  }

  saveItemsToLocalStorge(teams: Array<Bracket>) {
    this.localSorageSerive.saveItemsToLocalStorage(teams);

  }

  editSeeds() {
    this.disableSubmitButton = false;
    this.textDisabled = false;
  }

  random() {
    this.teams.sort((a, b) => 0.5 - Math.random());
    this.localSorageSerive.saveItemsToLocalStorage(this.teams);
  }

  winner(round: number, game: number, winner: string) {
    this.winners['round' + round + '-' + game] = winner;
    console.log(winner);
    this.toastService.showToast('success', 2000, 'The winner is ' + winner);
  }

  getWinnerName(round: number, game: number) {
    let name = this.winners['round' + round + '-' + game];
    return (name !== undefined) ? name : '';
  }

  getTeamName(index: number) {
    return (this.teams.length >= index) ? this.teams[index] : '';
  }

}
