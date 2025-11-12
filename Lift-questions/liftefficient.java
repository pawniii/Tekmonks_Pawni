import java.util.*;

public class liftefficient {
    public static void main(String[] args) {
        int[][] persons = {
            {1, 19},
            {17, 8},
            {7, 20}
        };

        
        Arrays.sort(persons, Comparator.comparingInt(a -> a[0]));

        double units = 0.0;
        int curr = 0;
        int prevDirection = 0; 
        
        // start cost: 0.5 only at the very beginning
        units += 0.5;

        for (int i = 0; i < persons.length; i++) {
            int pickup = persons[i][0];
            int drop = persons[i][1];

            // move to pickup
            int dist = Math.abs(pickup - curr);
            units += dist * 1.0; // 1 unit per floor
            if (dist > 0) {
                int dir = (pickup > curr) ? 1 : -1;
                if (prevDirection != 0 && dir != prevDirection) {
                    units += 0.5; // direction change cost
                }
                prevDirection = dir;
            }
            curr = pickup;

            // move to drop - prefer same direction as next pickup if ahead 
            int nextPickupDir = (i + 1 < persons.length) ? ((persons[i+1][0] > curr) ? 1 : -1) : 0;
            int dropDir = (drop > curr) ? 1 : -1;
            // if drop direction matches next pickup direction, do it (minimizes change); else, just do it
            dist = Math.abs(drop - curr);
            units += dist * 1.0; 
            if (dist > 0) {
                if (prevDirection != 0 && dropDir != prevDirection) {
                    units += 0.5; 
                }
                prevDirection = dropDir;
            }
            curr = drop;
        }

        System.out.println("Efficient Units: " + units);  
    }
}