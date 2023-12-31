import { Component } from '@angular/core';
import { Employe } from '../model/employe.model';
import { EmployeService } from '../service/employe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employe',
  templateUrl: './list-employe.component.html',
  styleUrls: ['./list-employe.component.css']
})
export class ListEmployeComponent {
  employes: Employe[];
  message: string | null = null;
  isError: boolean = false;
  isLoading = true;

  constructor(private employeService: EmployeService, private router: Router) {}

  ngOnInit(): void {
    this.chargerEmployes();
  }

  //Initialisation des données avec Datatable
  ngAfterViewInit() {
    setTimeout(() => {
      this.employeService.listeEmploye().subscribe((emps) => {
        this.isLoading = false;
        this.employes = emps;
        setTimeout(() => {
          $('#dataTable').DataTable({
            paging: true, // Active la pagination
            pageLength: 10, // Nombre de lignes par page
          });
        }, 0); 
      });
    }, 500);
  }

  chargerEmployes() {
    setTimeout(() => {
      this.employeService.listeEmploye().subscribe(
        (emps) => {
          this.isLoading = false;
          this.employes = emps;
        },
        (error) => {
          const errorMessage =
            error.error.message ||
            'Failed to load Employees. Please try again later.';
          this.showMessage(errorMessage, true);
        }
      );
    }, 500);
  }

  supprimerEmploye(e: Employe) {
    let conf = confirm('Etes-vous sûr de vouloire supprimer '+e.nomEmp+ ' ? \nCette action est irréversible.');
    if (conf)
      this.employeService.supprimerEmploye(e.id).subscribe(() => {
        //console.log('produit supprimé');
        this.chargerEmployes();
        this.showMessage('Employé supprimé!', false);
        this.router.navigate(['/employe']);
      });
  }

  showMessage(message: string, isError: boolean = false) {
    this.message = message;
    this.isError = isError;
  }
}
