import { Component } from '@angular/core';
import { Sortie } from '../model/sortie.model';
import { SortieService } from '../service/sortie.service';
import { Router } from '@angular/router';
import { MouvementService } from '../service/mouvement.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-list-sortie',
  templateUrl: './list-sortie.component.html',
  styleUrls: ['./list-sortie.component.css']
})
export class ListSortieComponent {
  sorties: Sortie[];
  message: string | null = null;
  errorMessage: string | null = null;
  isError: boolean = false;
  isLoading = true;
  
  constructor(
    private sortieService: SortieService,
    private mouvementService: MouvementService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerSorties();
  }

  //Initialisation des données avec Datatable
  ngAfterViewInit() {
    setTimeout(() => {
      this.sortieService.listeSortie().subscribe((sors) => {
        this.isLoading = false;
        this.sorties = sors;

        setTimeout(() => {
          $('#dataTable').DataTable({
            paging: true, // Active la pagination
            pageLength: 10, // Nombre de lignes par page
          });
        }, 0); 
      });
    }, 500);
  }

  supprimerSortie(s: Sortie) {
    let conf = confirm(
      'Etes-vous sûr de vouloire supprimer ' +
        s.codeSort +
        ' ? \nCette action est irréversible.'
    );
    if (conf)
      this.sortieService.supprimerSortie(s.id).subscribe(() => {
        this.chargerSorties();
        this.router.navigate(['/sortie']);
      });
  }

  validerSortie(s: Sortie) {
    let conf = confirm(
      'Voudriez-vous valider la sortie ' +
      '\n'+s.codeSort +' '+ s.fourniture.nomFour +' '+    
        s.fourniture.mesureFour + ' ?\n' +
      'Cette action est irréversible.'
    );
    if (conf) {
      s.etatSort = 'VA';
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString();
      const date_code = `${year}-${month}-${day}`;

      const lignemouvement = {
        id: null,
        datemouv: date_code,
        natureMouv: 'OUT',
        lignelivraison: null,
        fourniture: { id: s.fourniture.id },
        qteMouv: s.qteSort, 
        sortie: { id: s.id },
        codeMouv: null,
        dateInventaire: null,
        etatMouv: 'ACTIVE',
      };
      
      this.sortieService.modifierSortie(s).subscribe(
        () => {

          this.mouvementService.ajouterMouvement(lignemouvement).subscribe(
            () => {},
            (error) => {
              const errorMessage =
                error.error.message ||
                'Failed to Add This Out Stock in Mouvement Table. Please try again later.';
              this.showMessage(errorMessage, true);
            }
          );

          this.showMessage('Validation de '+ s.codeSort +' effectuée!', false);
          this.chargerSorties();
          this.router.navigate(['/sortie']);
        },
        (error) => {
          const errorMessage =
            error.error.message ||
            'Failed to Validate Livraison Fourniture. Please try again later.';
          this.showMessage(errorMessage, true);
        }
      );
    }
  }

  chargerSorties() {
    setTimeout(() => {
      this.sortieService.listeSortie().subscribe(
        (sorts) => {
          this.isLoading = false;
          this.sorties = sorts;
        },
        (error) => {
          const errorMessage =
            error.error.message ||
            'Failed to load Sortie Fourniture. Please try again later.';
          this.showMessage(errorMessage, true);
        }
      );
    }, 500);
  }

  showMessage(message: string, isError: boolean = false) {
    this.message = message;
    this.isError = isError;
  }
}
