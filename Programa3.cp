// ConsoleEntrega3.cpp : Este archivo contiene la función "main". La ejecución del programa comienza y termina ahí.
//

#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include "mpi.h"

const double a = 0;
const double b = 10;

/* Declaraciones de funciones */
void Get_input(int argc, char* argv[], int my_rank, double* n_p);
double Trap(double left_endpt, double right_endpt, int trap_count, double base_len);
double f(double x);



int main(int argc, char** argv)
{
    int my_rank, comm_sz, local_n;
    double n, h, local_a, local_b;
    double local_int, total_int;
    double start, finish, loc_elapsed, elapsed;

    MPI_Init(NULL, NULL);
    MPI_Comm_rank(MPI_COMM_WORLD, &my_rank);
    MPI_Comm_size(MPI_COMM_WORLD, &comm_sz);

    /*Imprime en consola el nucleo que ejecuto el proceso*/
    printf("soy el core nro. %d de %d\n", my_rank, comm_sz);

    Get_input(argc, argv, my_rank, &n); /*Leer la entrada del usuario*/
    /*Nota: h y local_n son iguales para todos los procesos */
    h = (b - a) / n;          /* longitud de cada trapecio */
    local_n = n / comm_sz;  /* cantidad de trapecios por proceso */

    /* Duraciónn del intervalo de integración de cada proceso = local_n * h. */
    local_a = a + my_rank * local_n * h;
    local_b = local_a + local_n * h;

    MPI_Barrier(MPI_COMM_WORLD);
    start = MPI_Wtime();

    /* Calcular la integral local de cada proceso utilizando puntos finales locales*/
    local_int = Trap(local_a, local_b, local_n, h);
    finish = MPI_Wtime();
    loc_elapsed = finish - start;
    MPI_Reduce(&loc_elapsed, &elapsed, 1, MPI_DOUBLE, MPI_MAX, 0, MPI_COMM_WORLD);

    /* Suma las integrales calculadas por cada proceso */
    MPI_Reduce(&local_int, &total_int, 1, MPI_DOUBLE, MPI_SUM, 0, MPI_COMM_WORLD);

    if (my_rank == 0)
    {
        printf("Con n = %.0f trapezoides, el valor de la integral entre %.0f a %.0f = %f \n",
            n, a, b, total_int);
        printf("Tiempo transcurrido = %f millisegundos \n", elapsed * 1000);
    }

    /* Cerrar MPI */
    MPI_Finalize();

    return 0;
/*  main  */
}

void Get_input(int argc, char* argv[], int my_rank, double* n_p)
{
    if (my_rank == 0) 
    {
        if (argc != 2) 
        {
            fprintf(stderr, "uso: mpirun -np <N> %d <numero de trapezoides> \n", argv[0]);
            fflush(stderr);
            *n_p = -1;
        }
        else
        {
            *n_p = atoi(argv[1]);
        }
    }

    MPI_Bcast(n_p, 1, MPI_DOUBLE, 0, MPI_COMM_WORLD);
    {
        // n negativo termina el programa
        if (*n_p <= 0) {
            MPI_Finalize();
            exit(-1);
        }
    }
}/* Get_input */



double Trap(double left_endpt, double right_endpt, int trap_count, double base_len)
{
    double estimate, x;
    int i;

    estimate = (f(left_endpt) + f(right_endpt)) / 2.0;
    for (i = 1; i <= trap_count - 1; i++) {
        x = left_endpt + i * base_len;
        estimate += f(x);
    }
    estimate = estimate * base_len;

    return estimate;
} /*  Trap  */


double f(double x)
{
    double x1;
    double x2;
    x1 = ((x - 4.0) * (x - 4.0) * (x - 4.0));
    x2 = 2.0 * x;
    return ((0.2 * x1) - x2) + 12.0;;
} /* f */




