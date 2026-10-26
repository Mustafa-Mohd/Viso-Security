import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hbmnibwwxjaqwggprcco.supabase.co';
const supabaseKey = 'sb_publishable_fpPBWpMNdLPae6247e2afw_Om5PSUFi'; 
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearClients() {
  const { data, error } = await supabase
    .from('cms_content')
    .delete()
    .eq('section_key', 'clients');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Successfully cleared clients from DB so the default 20 will show up!');
  }
}

clearClients();
