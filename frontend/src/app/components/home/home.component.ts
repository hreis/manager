import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { JobException, Job, JobResponse } from 'src/app/shared/models/Jobs';
import { ApiService } from 'src/app/shared/services/api.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Devs } from 'src/app/shared/models/Devs';
import { Users } from 'src/app/shared/models/Users';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // Need to remove view encapsulation so that the custom tooltip style defined in
  // `tooltip-custom-class-example.css` will not be scoped to this component's view.
})
export class HomeComponent implements OnInit {

  showSpinner = false;

  formGroup = new FormGroup({
    processFormControl: new FormControl('', Validators.required),
    jobFromControl: new FormControl('', Validators.required),
    devFormControl: new FormControl('', Validators.required),
    userFormControl: new FormControl('', Validators.required),
    spendMinutesFormControl: new FormControl('', Validators.required),
    stateFormControl: new FormControl('', Validators.required),
    searchFormControl: new FormControl('')
  });

  processes: JobException[];
  jobs: Job[];
  devs: Devs[];
  users: Users[];
  filteredOptions: Observable<Users[]>;
  idJob: number;

  constructor(private api: ApiService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.showSpinner = true;

    this.getJobsException();

    this.getUsers();

    this.getDevs();

    this.filteredOptions = this.formGroup.get('userFormControl').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): Users[] {
    const filterValue = value.toLowerCase();

    return this.users.filter(option => option.NM_USUARIO.toLowerCase().includes(filterValue));
  }

  getJobsException() {

    this.api.getJobsException().subscribe((res: JobException[]) => {

      this.processes = res;

    });

  }

  getJobs() {

    this.api.getJobs().subscribe((res: Job[]) => {

      this.jobs = res;

      console.log(this.jobs)

    });

  }

  getDevs() {

    this.api.getDevs().subscribe((res: Devs[]) => {

      this.devs = res;

    });

  }

  getUsers() {

    this.api.getUsers().subscribe((res: Users[]) => {

      this.users = res;

      this.showSpinner = false;

    });

  }

  selectProcess(event: Event) {

    this.formGroup.get('jobFromControl').setValue(String(event).replace('_Production', ''));

  }

  search() {

    const job = {
      ui: this.formGroup.get('searchFormControl').value,
    }

    this.api.search(job).subscribe((res: Job[]) => {

      try {

        if (res.length <= 0) {
          this.openSnackBar('Nenhum dado encontrado.', 'OK', 'alert-msg');
        }
        else {
          res.forEach((e) => {

            this.idJob = e.id;

            if (!this.processes.find(x => x.process === e.ui)) {

              this.processes.push({
                process: e.ui
              });

            }

            this.formGroup.get('processFormControl').setValue(e.ui);
            this.formGroup.get('jobFromControl').setValue(e.name);
            this.transformState(e.ativo);
            this.formGroup.get('devFormControl').setValue(e.devName);
            this.formGroup.get('spendMinutesFormControl').setValue(e.manual);

          });
        }

      } catch (error) {

        this.openSnackBar('Erro ao pesquisar.', 'OK', 'error-msg');

      }

    })

  }

  transformState(ativo: string) {

    switch (ativo) {

      case 'S':
        this.formGroup.get('stateFormControl').setValue(0);
        break;
      case 'N':
        this.formGroup.get('stateFormControl').setValue(1);
        break;
      default:
        break;

    }

  }

  insert(job: Job) {

    this.api.postJob(job).subscribe((res: JobResponse) => {


      try {
        const id = JSON.parse(String(res));
        this.openSnackBar(`Inserido com sucesso. ID: ${id}`, 'OK', 'success-msg');

      } catch (error) {
        this.openSnackBar('Erro ao inserir.', 'OK', 'error-msg');
      }

    });

  }

  delete(id: number) {

    if (this.idJob !== undefined) {

      this.api.delete(this.idJob).subscribe((res: number) => {

        if (res > 0) {
          this.openSnackBar('Deletado com sucesso.', 'OK', 'success-msg');
        }
        else {
          this.openSnackBar('Erro ao deletar.', 'OK', 'error-msg');
        }

      });

    }
    else {
      this.openSnackBar('Não há o que deletar.', 'OK', 'alert-msg');
    }

  }

  onFormSubmit() {

    if (this.formGroup.valid) {

      let job: Job;

      job = {
        id: 0,
        ui: this.formGroup.get('processFormControl').value,
        name: this.formGroup.get('jobFromControl').value,
        devName: this.formGroup.get('devFormControl').value,
        usrName: this.formGroup.get('userFormControl').value,
        ativo: 'N',
        manual: this.formGroup.get('spendMinutesFormControl').value
      }

      this.insert(job);

    }
    else {
      this.openSnackBar('Preencha todos os campos necessários.', 'OK', 'alert-msg');
    }

  }

  openSnackBar(message: string, action: string, css: string) {
    this._snackBar.open(message, action, {
      duration: 8000,
      panelClass: [css]
    });
  }

}
