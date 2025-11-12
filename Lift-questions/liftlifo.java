import java.util.*;

public class liftlifo {
    public static void main(String[] args) {
        // Example input: list of people as {initial floor, final floor}
        List<int[]> people = Arrays.asList(
            new int[]{1, 19},
            new int[]{17, 8},
            new int[]{7, 20}
        );
        
        // LIFO: Push all requests to stack, then pop and serve (last in, first out)
        Stack<int[]> stack = new Stack<>();
        for (int[] p : people) {
            stack.push(p);
        }
        
        double units = calculateUnits(stack);
        System.out.println("LIFO Units: " + units);  // This gives 45.5 based on your rules
    }
    
    private static double calculateUnits(Iterable<int[]> requests) {
        double units = 0.0;
        int currentFloor = 0;
        int prevDirection = 0; // 0: none, 1: up, -1: down
        
        // Start cost: 0.5 only at the very beginning
        units += 0.5;
        
        for (int[] p : requests) {
            int i = p[0], j = p[1];
            
            // Move to initial floor i (pickup)
            int dist = Math.abs(i - currentFloor);
            units += dist * 1.0; // 1 unit per floor
            if (dist > 0) {
                int dir = (i > currentFloor) ? 1 : -1;
                if (prevDirection != 0 && dir != prevDirection) {
                    units += 0.5; // direction change cost
                }
                prevDirection = dir;
            }
            currentFloor = i;
            
            // Move to final floor j (drop)
            dist = Math.abs(j - currentFloor);
            units += dist * 1.0; // 1 unit per floor
            if (dist > 0) {
                int dir = (j > currentFloor) ? 1 : -1;
                if (prevDirection != 0 && dir != prevDirection) {
                    units += 0.5; // direction change cost
                }
                prevDirection = dir;
            }
            currentFloor = j;
        }
        
        return units;
    }
}