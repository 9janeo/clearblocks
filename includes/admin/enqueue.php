<?php

function ccb_admin_enqueue($hook_suffix){
    if( $hook_suffix === 'toplevel_page_clearblocks-plugin-options' || 
        $hook_suffix === 'clearblocks_page_clearblocks-plugin-options-alt'
    ) {
        wp_enqueue_media();
        wp_enqueue_style('ccb_admin');
        wp_enqueue_script('ccb_admin');
    }
}