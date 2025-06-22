@@ .. @@
   Tooltip, Legend, ResponsiveContainer
 } from 'recharts';
+import { useTheme } from '../../context/ThemeContext';
 
 const COLORS = ['#4CAF50', '#9C27B0', '#FF9800', '#2196F3', '#E91E63'];
+const DARK_COLORS = ['#6BCB77', '#B85EE6', '#FFB74D', '#64B5F6', '#F06292'];
 
 interface PharmacyChartsProps {
@@ .. @@
 export const PharmacyCharts: React.FC<PharmacyChartsProps> = ({
   popularMedicines,
   categoryDistribution
 }) => {
+  const { theme } = useTheme();
+  
   // Transform category distribution data for the pie chart
   const categoryData = categoryDistribution.map(([name, value]) => ({
     name,
@@ .. @@
   return (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
       {/* Category Distribution */}
-      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-colors duration-300">
-        <h3 className="text-lg font-semibold mb-4 text-gray-700">Medicine Categories</h3>
+      <div className={`backdrop-blur-md p-6 rounded-2xl shadow-lg border transition-colors duration-300 ${
+        theme === 'dark'
+          ? 'bg-gray-800/20 border-gray-700/30 hover:bg-gray-800/30'
+          : 'bg-white/20 border-white/30 hover:bg-white/30'
+      }`}>
+        <h3 className={`text-lg font-semibold mb-4 ${
+          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
+        }`}>Medicine Categories</h3>
         <div className="flex items-center justify-center">
           <ResponsiveContainer width="100%" height={300}>
             <PieChart>
@@ .. @@
                 {categoryData.map((entry, index) => (
                   <Cell 
                     key={`cell-${index}`} 
-                    fill={COLORS[index % COLORS.length]}
+                    fill={theme === 'dark' ? DARK_COLORS[index % DARK_COLORS.length] : COLORS[index % COLORS.length]}
                     strokeWidth={2}
                   />
                 ))}
               </Pie>
               <Tooltip 
-                contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
-                itemStyle={{ color: '#374151' }}
+                contentStyle={{ 
+                  backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
+                  border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB', 
+                  borderRadius: '8px',
+                  color: theme === 'dark' ? '#E5E7EB' : '#374151'
+                }}
+                itemStyle={{ 
+                  color: theme === 'dark' ? '#E5E7EB' : '#374151' 
+                }}
               />
               <Legend 
-                formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
+                formatter={(value) => <span style={{ color: theme === 'dark' ? '#E5E7EB' : '#374151' }}>{value}</span>}
               />
             </PieChart>
           </ResponsiveContainer>
         </div>
       </div>
 
       {/* Popular Medicines Trend */}
-      <div className="bg-white/20 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/30 hover:bg-white/30 transition-colors duration-300">
-        <h3 className="text-lg font-semibold mb-4 text-gray-700">Popular Medicines</h3>
+      <div className={`backdrop-blur-md p-6 rounded-2xl shadow-lg border transition-colors duration-300 ${
+        theme === 'dark'
+          ? 'bg-gray-800/20 border-gray-700/30 hover:bg-gray-800/30'
+          : 'bg-white/20 border-white/30 hover:bg-white/30'
+      }`}>
+        <h3 className={`text-lg font-semibold mb-4 ${
+          theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
+        }`}>Popular Medicines</h3>
         <ResponsiveContainer width="100%" height={300}>
           <AreaChart data={popularData}>
             <defs>
               <linearGradient id="popularGradient" x1="0" y1="0" x2="0" y2="1">
-                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
-                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
+                <stop offset="5%" stopColor={theme === 'dark' ? '#6BCB77' : '#4CAF50'} stopOpacity={0.8}/>
+                <stop offset="95%" stopColor={theme === 'dark' ? '#6BCB77' : '#4CAF50'} stopOpacity={0}/>
               </linearGradient>
             </defs>
-            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
+            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
             <XAxis 
               dataKey="name" 
-              stroke="#6B7280"
+              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
+              tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
             />
             <YAxis 
-              stroke="#6B7280"
+              stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'}
+              tick={{ fill: theme === 'dark' ? '#D1D5DB' : '#6B7280' }}
             />
             <Tooltip 
-              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px' }}
-              itemStyle={{ color: '#374151' }}
+              contentStyle={{ 
+                backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF', 
+                border: theme === 'dark' ? '1px solid #374151' : '1px solid #E5E7EB', 
+                borderRadius: '8px' 
+              }}
+              itemStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#374151' }}
+              labelStyle={{ color: theme === 'dark' ? '#E5E7EB' : '#374151' }}
             />
             <Area
               type="monotone"
               dataKey="quantity"
-              stroke="#4CAF50"
+              stroke={theme === 'dark' ? '#6BCB77' : '#4CAF50'}
               fillOpacity={1}
               fill="url(#popularGradient)"
             />
           </AreaChart>
         </ResponsiveContainer>
       </div>
     </div>
   );
 };